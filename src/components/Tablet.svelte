<script lang="ts">
  import { onMount } from "svelte";
  import { Collection, Playlist, Track, PlaylistTrack, shuffle } from "@components/meta/collection";
  import { Player } from "@components/audio/spotify";
  import { State } from "@components/audio/player";

  let { accessToken = "" } = $props();

  let collection = $state.frozen(Collection());
  let playlist = $state.frozen(Playlist());
  let track = $state.frozen(PlaylistTrack(Playlist(), Track()));

  const player = Player({
    onEnd: async (s: State) => {
      console.log("onEnd", s);
      await queueShift();
    },
    onInit: (id: string) => {
      console.log("onInit", id);
    },
    onLog: (msg: string) => {
      console.log("onLog", msg);
    },
  });

  player.accessToken = accessToken;

  let q = $state({
    queue: [] as PlaylistTrack[],
    shuffle: [] as PlaylistTrack[],
    history: [] as PlaylistTrack[],
  });

  let ui = $state({
    debug: false,
    queue: true,
    queueTab: "queue" as "queue" | "shuffle" | "history",
  });

  const queuePush = async (pt: PlaylistTrack) => {
    q.queue.push(pt);

    const s = await player.state();
    if (s.uri == "") await queueShift();
  };

  const queueShift = async () => {
    const pt = q.queue.length > 0 ? q.queue.shift() : q.shuffle.shift();
    if (pt == undefined) return;

    track = pt;
    q.history.unshift(pt);
    await player.play(pt.track.uri);
  };

  const queueShuffle = () => {
    if (q.shuffle.length > 0) return;

    const pts: PlaylistTrack[] = [];
    collection.playlists.forEach((p) => {
      p.tracks.forEach((t) => {
        pts.push(PlaylistTrack(p, t));
      });
    });

    q.shuffle = shuffle(pts);
  };

  onMount(async () => {
    await player.init();

    const res = await fetch(`/collection.json`);
    collection = (await res.json()) as Collection;
    playlist = collection.playlists[0];
    queueShuffle();
  });
</script>

<div class="drawer">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="flex h-screen w-screen flex-col overflow-hidden">
      <div class="flex h-full flex-col">
        <!-- top nav -->
        <div class="navbar bg-base-100">
          <div class="navbar-start">
            <label for="drawer" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"
                ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg
              >
            </label>
          </div>
          <div class="navbar-center">
            <button class="btn btn-ghost text-xl">JukeLab</button>
          </div>
          <div class="navbar-end">
            <button class="btn btn-circle btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg
              >
            </button>
            <button class="btn btn-circle btn-ghost">
              <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  /></svg
                >
                <span class="badge indicator-item badge-primary badge-xs"></span>
              </div>
            </button>
          </div>
        </div>

        <!-- main with scroll -->
        <div class="flex flex-grow justify-end overflow-y-scroll">
          <div class="flex w-full flex-col overflow-y-scroll">
            <div>
              <div class="carousel carousel-center h-64 cursor-pointer rounded-box">
                {#each collection.playlists as p, i}
                  <button
                    class="group carousel-item relative"
                    onclick={() => {
                      playlist = collection.playlists[i]!;
                    }}
                  >
                    <div class="btn btn-square btn-primary absolute bottom-0 right-0 m-2 hidden items-center justify-center group-hover:flex">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                        <path
                          fill-rule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <img class="h-64 w-64" src={p.images[0]} alt={p.title} />
                  </button>
                {/each}
              </div>
            </div>
            <div class="flex-grow cursor-pointer overflow-y-scroll rounded-box border">
              {#each playlist.tracks as t, i}
                <div class="group w-full truncate">
                  <div class="flex flex-row items-center group-hover:bg-accent">
                    <button class="btn btn-square btn-ghost" onclick={() => queuePush(PlaylistTrack(playlist, t))}>
                      <div class="block group-hover:hidden">{i.toString().padStart(2, "0")}</div>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="hidden h-6 w-6 group-hover:block">
                        <path
                          fill-rule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <div>{t.author} - {t.title}</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          <div class="flex w-80 flex-col rounded-box border {ui.queue || 'hidden'}">
            <div role="tablist" class="tabs tabs-lifted w-80">
              <button
                role="tab"
                class="tab {ui.queueTab == 'queue' && 'tab-active'}"
                onclick={() => {
                  ui.queueTab = "queue";
                }}>Queue</button
              >

              <button
                role="tab"
                class="tab {ui.queueTab == 'shuffle' && 'tab-active'}"
                onclick={() => {
                  ui.queueTab = "shuffle";
                }}>Shuffle</button
              >

              <button
                role="tab"
                class="tab {ui.queueTab == 'history' && 'tab-active'}"
                onclick={() => {
                  ui.queueTab = "history";
                }}>History</button
              >
            </div>

            <div class="flex w-80 flex-col overflow-y-scroll">
              {#snippet list(tracks: PlaylistTrack[], tab: string)}
                {#each tracks as ts}
                  <div class="flex p-1 {ui.queueTab == tab || 'hidden'}">
                    <img class="h-12 w-12" src={ts.playlist.images[0]} alt="art" />
                    <div class="flex flex-col truncate pl-2">
                      <div>{ts.track.title}</div>
                      <div>{ts.track.author}</div>
                    </div>
                  </div>
                {/each}
              {/snippet}

              {@render list(q.queue, "queue")}
              {@render list(q.shuffle.slice(0, 10), "shuffle")}
              {@render list(q.history, "history")}
            </div>
          </div>
        </div>

        <!-- bottom nav -->
        <div class="navbar bg-base-100">
          <div class="navbar-start"></div>
          <div class="navbar-center">
            <button class="btn btn-ghost text-xl">JukeLab</button>
          </div>
          <div class="navbar-end">
            <button
              class="btn btn-circle btn-ghost"
              onclick={() => {
                ui.debug = !ui.debug;
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </button>
            <button
              class="btn btn-circle btn-ghost"
              onclick={() => {
                ui.queue = !ui.queue;
              }}
            >
              <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                  />
                </svg>
                <span class="badge indicator-item badge-primary badge-xs">{q.queue.length}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- footer -->
        <footer class="footer h-80 items-center bg-neutral p-4 text-neutral-content {ui.debug || 'hidden'}"></footer>
      </div>
    </div>
  </div>
  <div class="drawer-side">
    <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
      <li>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
            />
          </svg>
          Playlist
        </button>
      </li>
    </ul>
  </div>
</div>
