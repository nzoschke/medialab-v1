<script lang="ts">
  import { onMount, tick } from "svelte";
  import { Recorder } from "@components/capture/obs";
  import { Mic } from "@components/audio/input";

  let { url = "" } = $props();
  let { origin, password } = new URL(url);

  let init = $state(false);
  const logs = $state<string[]>(["OBS Recorder"]);

  let out = $state<string>();

  const recorder = Recorder({
    onLog: (msg) => {
      logs.push(msg);
    },
    onInit: (ok) => {
      init = ok;
    },
  });

  const record = async () => {
    out = "";
    await tick();
    await recorder.start();
    setTimeout(async () => {
      out = await recorder.stop();
    }, 5000);
  };

  onMount(async () => {
    const { Visualizer } = await import("@components/visual/Butterchurn");

    const u = new URL(url);
    await recorder.init(origin, password);

    let { context, node } = await Mic(null);
    const canvas = document.getElementsByTagName("canvas")[0]!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const viz = Visualizer(context, node, canvas);

    await viz.fetchPreset(
      "https://nzoschke.github.io/vizlab-presets/Presets/Dancer/Infect_Mirror/HDFX_Trend_NDropFX_with_AdamFX-Hexcollie-Armandio_C-Geiss-Martin_nOtherfoUrmKinGzFX_A.json",
      0,
    );
  });
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
  <canvas class="block h-full w-full"></canvas>
  <div class="absolute flex h-full w-full flex-col items-center justify-center text-6xl"></div>
  <div class="absolute flex h-full w-full flex-col items-center justify-center text-6xl">
    <div class={out || "hidden"}>
      Output: {out}
    </div>
    <div class="flex flex-col items-center {out == undefined || 'hidden'}">
      {#if init}
        <div>Connected to OBS with <span class="font-mono">{origin}</span></div>
      {:else}
        <div>Error connecting. Start with <span class="font-mono">OBS --use-fake-ui-for-media-stream</span></div>
      {/if}

      <button
        class="btn z-10 size-96 {init ? 'btn-primary' : 'btn-disabled'}"
        onclick={() => {
          record();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-96">
          <path
            fill-rule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
