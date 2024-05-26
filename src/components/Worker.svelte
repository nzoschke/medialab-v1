<script lang="ts">
  import { onMount } from "svelte";

  let audio = $state({
    currentTime: 0,
    duration: 0,
    paused: true,
    src: "influence.m4a",
    volume: 0.7,
  });

  const ui = $state({
    progress: 0,
  });

  onMount(async () => {
    if ("serviceWorker" in navigator) {
      const { Workbox } = await import("workbox-window");
      const wb = new Workbox("/sw.js");
      await wb.register();

      const cacheProgress = new BroadcastChannel("CACHE_PROGRESS");

      cacheProgress.onmessage = ({ data }) => {
        if (data?.type === "CACHE_PROGRESS") {
          ui.progress = data.progress;
        }
      };

      await wb.messageSW({
        payload: {
          src: audio.src,
        },
        type: "CACHE_MEDIA",
      });
    }
  });
</script>

<progress class="progress w-full {ui.progress == 1 && 'hidden'}" value={ui.progress} max="1"></progress>

<input type="range" min="0" max={audio.duration} step="0.001" bind:value={audio.currentTime} class="range rounded-none" />

<button onclick={() => (audio.paused = !audio.paused)}>
  {audio.paused ? "Play" : "Pause"}
</button>

<audio src={audio.src} bind:currentTime={audio.currentTime} bind:duration={audio.duration} bind:paused={audio.paused} bind:volume={audio.volume}></audio>
