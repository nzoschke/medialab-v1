/// <reference types="@types/spotify-web-playback-sdk"/>

import { type Devices } from "@spotify/web-api-ts-sdk";
import { PlaybackState } from "@components/audio";

export const Audio = () => {
  // https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
  let accessToken =
    "BQDcLiEdND9HckOtI5cqIQmgdSnStvG7F2wmFIvrYacHfGnprdUQ7iOg4rIQ7RzMl6fiaYsu5YwuHb5TYyO8D5dt_UGnwuUADhFq469VqpfQnjpxzBaIW5Ma4pyu2Z6XDqZQhN8nf6a2SRvvEL_nmhMCLhkDATyDHUY_JaAoCVpRYvRuSVm94vj8rpT0SxZ3ysPxnQ";
  let deviceId = "";
  let player: Spotify.Player | undefined;
  let playbackState = PlaybackState();

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
        console.log(`ready deviceId=${device_id}`);
        deviceId = device_id;
        resolve(true);
      });

      let endedTimeout: number | undefined;
      player.addListener("player_state_changed", (e) => {
        // filter and dedup Spotify events
        if (e == undefined) return;

        const ps = toPlaybackState(e);
        if (playbackState.paused == ps.paused && playbackState.position == ps.position && playbackState.uri == ps.uri) return;
        playbackState = ps;

        const {
          paused,
          position,
          track_window: { current_track, previous_tracks },
        } = e;

        console.log(`player_state_changed paused=${paused} position=${position} track=${current_track?.name}`);

        // "debounce" multiple stopping events
        if (paused && position == 0 && previous_tracks?.findIndex((t) => t.id === current_track.id) !== -1) {
          if (endedTimeout == undefined) {
            console.log(`ended track=${current_track.name}`);
            window.dispatchEvent(new CustomEvent("ended"));
          }

          endedTimeout = setTimeout(() => {
            endedTimeout = undefined;
          }, 700);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log(`not_ready device=${device_id}`);
        reject(false);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.log("initialization_error", message);
        reject(false);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.log("authentication_error", message);
        reject(false);
      });

      player.addListener("account_error", ({ message }) => {
        console.log("account_error", message);
        reject(false);
      });

      player.connect().then((ok) => {
        console.log("connect", ok);
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
    console.log("play", uri);

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
    return toPlaybackState(await player?.getCurrentState());
  };

  return {
    init,
    play,
    state,
  };
};

const toPlaybackState = (s: Spotify.PlaybackState | null | undefined): PlaybackState => {
  if (!s) return PlaybackState();

  const t: Spotify.Track | undefined = s.track_window.current_track;

  return {
    duration: t.duration_ms,
    paused: s.paused,
    position: s.position,
    uri: t?.uri || "",
  };
};
