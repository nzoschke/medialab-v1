<script lang="ts">
  import { CreateMedia, Gesture, type DeviceElement } from "@components/audio/input";
  import { Phrases, type Message, type Phrase } from "@components/meta/analysis";
  import { Timeline, type Div, type Status } from "@components/timeline";
  import { Visualiser } from "@components/visual/bc";
  import { onMount } from "svelte";

  let audio!: DeviceElement;

  let phrase = $state<Phrase>({
    beat: 0,
    kind: "",
    onAir: false,
    player: 0,
  });

  const ui = $state({
    divs: [] as Div[],
    paused: true,
    progress: 0,
    status: "new" as Status,
  });

  // bind timeline and UI state
  const timeline = Timeline();

  timeline.opts = {
    onStatus: (s) => {
      ui.status = s;
    },
    onProgress: (p) => {
      ui.progress = p;
    },
  };

  $effect(() => {
    timeline.progress(ui.progress);
  });

  const { ongesture, gesture } = Gesture();

  const pauseResume = async () => {
    audio.progress(ui.progress);
    audio.pauseResume();
    timeline.pauseResume();
    ui.paused = !ui.paused;
  };

  onMount(async () => {
    const msgs = await Phrases("/influence.json");
    for (var i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      timeline.timeline.call(
        (msg: Message) => {
          console.log(msg.payload);
          phrase.kind = msg.payload.kind;
        },
        [msg],
        msg.ms / 1000,
      );
    }

    // FIXME: add tween for song end
    ui.divs = timeline.divs();

    audio = await CreateMedia("/influence.m4a");
    await ongesture(async () => {
      audio.context.resume();
      pauseResume();
    });

    Visualiser(audio.context, audio.node, document.getElementsByTagName("canvas")[0]);
  });
</script>

<div class="flex h-screen w-screen flex-col overflow-hidden">
  <div class="flex">
    <button class="btn btn-square btn-sm {ui.status == 'new' || 'hidden'}" onclick={() => gesture()}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path
          fill-rule="evenodd"
          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <button
      class="btn btn-square btn-sm {ui.status == 'new' && 'hidden'}"
      onclick={() => {
        pauseResume();
      }}
    >
      {#if ui.paused}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path
            fill-rule="evenodd"
            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
            clip-rule="evenodd"
          />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path
            fill-rule="evenodd"
            d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
            clip-rule="evenodd"
          />
        </svg>
      {/if}
    </button>
    <div class="flex w-full flex-col justify-center">
      <div class="relative flex h-6 w-full rounded-box">
        {#each ui.divs as tw}
          <div class="absolute h-6 border-l border-accent" style="left: {tw.left}%; width: {tw.width}%;"></div>
        {/each}
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.001"
        bind:value={ui.progress}
        class="range absolute rounded-none opacity-60"
        onchange={() => {
          audio.progress(ui.progress);
        }}
      />
    </div>
  </div>
  <div class="">Phrase: {phrase.kind}</div>
  <canvas class="block h-full w-full bg-black"></canvas>
</div>

<style>
  /* https://github.com/saadeghi/daisyui/blob/master/src/components/styled/range.css */
  ::-webkit-slider-thumb {
    border-radius: 0;
    width: 5px;
    --filler-offset: 0rem;
    box-shadow:
      0 0 0 10px oklch(var(--s)) inset,
      var(--focus-shadow, 0 0),
      calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size);
  }
</style>
