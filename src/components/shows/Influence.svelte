<script lang="ts">
  import { CreateMedia, Gesture, type DeviceElement } from "@components/audio/input";
  import { Messages, type Message, type Phrase, type Player } from "@components/meta/analysis";
  import { Timeline, type Div, type Status } from "@components/timeline";
  import type { Viz } from "@components/visual/Butterchurn";
  import { Visualiser } from "@components/visual/bc";
  import { onMount } from "svelte";

  let audio!: DeviceElement;
  let viz: Viz | undefined;

  let player = $state<Player>({});

  let jpg = $derived.by(() => {
    let data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAmklEQVR42mP8//8/w1IDpgU3AGmLgOgC1D5AZgAACgoKCgoAAJyjOgiAAAAAElFTkSuQmCC";
    if (player.art?.jpg && player.art.jpg.length > 0) {
      data = `data:image/jpg;base64,${player.art.jpg}`;
    }
    return data;
  });

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
    const canvas = document.getElementsByTagName("canvas")[0];

    const all = await Messages("/influence.json");
    player.art = all.find((msg) => msg.type == "art")?.payload;

    let msgs = all.filter((msg) => msg.type == "sys");
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      timeline.timeline.call(
        (msg: Message) => {
          console.log("sys", msg.ms, msg.payload);
        },
        [msg],
        msg.ms / 1000,
      );
    }

    msgs = all.filter((msg) => msg.type == "cue");
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      timeline.timeline.call(
        (msg: Message) => {
          console.log("cue", msg.ms, msg.payload);
        },
        [msg],
        msg.ms / 1000,
      );
    }

    msgs = all.filter((msg) => msg.type == "phrase");
    for (let i = 0; i < msgs.length; i++) {
      const msg = msgs[i];
      timeline.timeline.call(
        (msg: Message) => {
          console.log("phrase", msg.ms, msg.payload);
          phrase = msg.payload;
          if (phrase.beat == 145) {
            viz?.fetchPreset("https://nzoschke.github.io/vizlab-presets/Presets/Waveform/Wire_Flat_Double/Serge_+_cope-the_drain2.json", 10);
          }

          if (phrase.beat == 225) {
            viz?.fetchPreset("https://nzoschke.github.io/vizlab-presets/Presets/Reaction/Mountains/cope_+_flexi-mother-of-whirl_other_kids_toys_.json", 10);
          }
          // /Reaction/Liquid_Ripples/flexi-bg_test_6
          // /Waveform/Wire_Flat_Double/Serge_+_cope-the_drain2
          // Presets/Reaction/Mountains/cope_+_flexi-mother-of-whirl_other_kids_toys_.json
          // viz.fetchPreset("https://nzoschke.github.io/vizlab-presets/Presets//Waveform/Wire_Flat_Double/Serge_+_cope-the_drain2.json")
          // viz.fetchPreset("https://nzoschke.github.io/vizlab-presets/Presets/Waveform/Wire_Flat/224.json")
        },
        [msg],
        msg.ms / 1000,
      );
    }

    ui.divs = timeline.divs();

    audio = await CreateMedia("/influence.m4a");
    await ongesture(async () => {
      audio.context.resume();
      pauseResume();
    });

    viz = await Visualiser(audio.context, audio.node, canvas);
    await viz.fetchPreset("https://nzoschke.github.io/vizlab-presets/Presets/Waveform/Wire_Flat/224.json", 0);
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
  <div class="">Phrase: {phrase.kind} {phrase.beat}</div>
  <div class="pointer-events-none absolute flex h-full w-full items-center justify-center">
    <img class="h-96 w-96 opacity-35" src={jpg} alt="art" />
  </div>
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
