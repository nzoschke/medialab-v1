<script lang="ts">
  import { gsap } from "gsap";
  import { Timeline, type State, type Status } from "@components/timeline";

  let structure = $state({
    phrase: "low",
  });

  // bind timeline and UI state
  const timeline = Timeline();

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

  for (var i = 0; i < 6; i++) {
    timeline.timeline.set(
      structure,
      {
        phrase: `phrase-${i}`,
        data: {
          i,
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
<input type="range" min="0" max="1" step="0.001" bind:value={ui.progress} class="range" />

{#each timeline.datas() as tw, i}
  {tw.data.i}
{/each}
