<script lang="ts">
  import { gsap } from "gsap";
  import { Timeline, type State, type Status } from "@components/timeline";

  let structure = $state({
    phrase: "low",
  });

  // bind timeline and UI state
  const timeline = $state(Timeline());

  let ui: State = $state({
    progress: 0,
    status: "new" as Status,
  });

  timeline.opts = {
    onStatus: (s) => {
      ui.status = s;
    },
    onProgress: (p) => {
      ui.progress = p;
    },
  };

  $effect(() => {
    timeline.progress = ui.progress;
  });

  for (var i = 0; i <= 5; i++) {
    timeline.timeline.set(
      structure,
      {
        phrase: `phrase-${i}`,
        data: {
          duration: 1,
        },
      },
      i,
    );

    timeline.timeline.call(
      (p, i) => {
        console.log("call", p, i);
      },
      ["param", i],
      i,
    );
  }
</script>

<div>{structure.phrase}</div>
<div>{ui.status}</div>

<button
  class="btn"
  onclick={() => {
    timeline.pauseResume();
  }}
>
  {ui.status == "play" ? "Pause" : "Play"}
</button>

<input type="range" min="0" max="1" step="0.001" bind:value={ui.progress} class="range rounded-none" />

<div class="relative flex h-6 w-full rounded-box">
  {#each timeline.divs() as tw}
    <div class="absolute h-6 border" style="left: {tw.left}%; width: {tw.width}%;"></div>
  {/each}
</div>

<style>
  /* https://github.com/saadeghi/daisyui/blob/master/src/components/styled/range.css */
  ::-webkit-slider-thumb {
    border-radius: 0;
    width: 5px;
    --filler-offset: 0rem;
    box-shadow:
      0 0 0 1px var(--range-shdw) inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
  }
</style>
