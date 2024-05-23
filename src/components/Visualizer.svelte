<script lang="ts">
  import { onMount } from "svelte";
  import { Context, Mic } from "@components/audio/input";
  import { throttle } from "@components/util";

  onMount(async () => {
    const { Visualizer } = await import("@components/visual/Butterchurn");

    let { context, node } = await Mic(null);
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
  <canvas class="block h-screen w-screen"></canvas>
</div>
