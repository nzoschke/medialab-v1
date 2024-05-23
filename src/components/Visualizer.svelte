<script lang="ts">
  import { onMount } from "svelte";
  import { Context, Mic } from "@components/audio/input";
  import { throttle } from "@components/util";

  const logs = $state<string[]>(["HELLO WORLD"]);

  const _log = (msg: string) => {
    logs.push(msg);
  };

  onMount(async () => {
    _log("onMount");

    const { Visualizer } = await import("@components/visual/Butterchurn");

    window.onerror = (e) => {
      _log(e.toString());
      // logs.push(e.toString());
    };

    let { context, node } = await Mic(null);
    _log(`Mic state=${context.state}`);

    const canvas = document.getElementsByTagName("canvas")[0]!;
    const viz = Visualizer(context, node, canvas);

    new ResizeObserver(
      throttle(() => {
        viz.resize(window.innerWidth, window.innerHeight);
      }, 500),
    ).observe(canvas);

    await viz.fetchPreset(
      "https://nzoschke.github.io/vizlab-presets/Presets/Dancer/Infect_Mirror/HDFX_Trend_NDropFX_with_AdamFX-Hexcollie-Armandio_C-Geiss-Martin_nOtherfoUrmKinGzFX_A.json",
      0,
    );
  });
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
  <canvas class="block h-96 w-96"></canvas>

  <footer class="text-x footer z-50 min-h-48 items-center bg-neutral p-4 text-green-400">
    <div class="flex h-full w-full flex-col-reverse overflow-auto leading-none">
      {#each logs as log}
        <pre><code>{log}</code></pre>
      {/each}
    </div>
  </footer>
</div>
