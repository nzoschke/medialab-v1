/// <reference types="@types/spotify-web-playback-sdk"/>

import { type Options, State } from "@components/audio/player";

export const Player = (opts?: Options) => {
  let accessToken = ""; // https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
  let deviceId = "";
  let player: Spotify.Player | undefined;
  let _state = State();

  const _log = (msg: string) => {
    if (opts?.onLog) return opts.onLog(msg);
    console.log(msg);
  };

  const connect = async () => {
    if (player != undefined) return true;

    return new Promise((resolve, reject) => {
      player = new Spotify.Player({
        getOAuthToken: async (cb) => {
          // or redirect to auth then fetch refresh token
          cb(accessToken);
        },
        name: "MediaLab",
        volume: 1.0,
      });

      player.addListener("ready", ({ device_id }) => {
        _log(`ready deviceId=${device_id}`);
        deviceId = device_id;
        if (opts?.onInit) opts.onInit(deviceId);
        resolve(true);
      });

      let endedTimeout: number | undefined;
      player.addListener("player_state_changed", (e) => {
        // filter and dedup Spotify events
        if (e == undefined) return;

        const ps = toState(e);
        if (_state.paused == ps.paused && _state.position == ps.position && _state.uri == ps.uri) return;
        _state = ps;

        const {
          paused,
          position,
          track_window: { current_track, previous_tracks },
        } = e;

        _log(`player_state_changed paused=${paused} position=${position} track=${current_track?.name}`);

        // "debounce" multiple stopping events
        if (paused && position == 0 && previous_tracks?.findIndex((t) => t.id === current_track.id) !== -1) {
          if (endedTimeout == undefined) {
            _log(`ended track=${current_track.name}`);
            if (opts?.onEnd) opts.onEnd(_state);
          }

          endedTimeout = setTimeout(() => {
            endedTimeout = undefined;
          }, 700);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        _log(`not_ready device=${device_id}`);
        reject(false);
      });

      player.addListener("initialization_error", ({ message }) => {
        _log(`initialization_error ${message}`);
        reject(false);
      });

      player.addListener("authentication_error", ({ message }) => {
        _log(`authentication_error ${message}`);
        reject(false);
      });

      player.addListener("account_error", ({ message }) => {
        _log(`account_error ${message}`);
        reject(false);
      });

      player.connect().then((ok) => {
        _log(`connect ${ok}`);
      });

      player.activateElement();
    });
  };

  const init = async () => {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      await connect();
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.head.appendChild(script);
  };

  const _play = async (uri: string) => {
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      body: JSON.stringify({
        device_id: deviceId,
        uris: [uri],
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "PUT",
    });
  };

  const play = async (uri: string) => {
    _log(`play ${uri}`);

    await connect();
    await player?.activateElement();

    const res = await _play(uri);
    if (res.ok) return true;

    // sleep, introspect, then retry on 502
    if (res.status == 502) {
      await new Promise((r) => setTimeout(r, 500));

      const s = await player?.getCurrentState();
      if (!s?.paused) return true;

      const res = await _play(uri);
      if (res.ok) return true;
    }

    return false;
  };

  const state = async () => {
    return toState(await player?.getCurrentState());
  };

  return {
    set accessToken(s: string) {
      accessToken = s;
    },
    init,
    play,
    state,
  };
};

const toState = (s: Spotify.PlaybackState | null | undefined): State => {
  if (!s) return State();

  const t: Spotify.Track | undefined = s.track_window.current_track;

  return {
    duration: t.duration_ms,
    paused: s.paused,
    position: s.position,
    uri: t?.uri || "",
  };
};
