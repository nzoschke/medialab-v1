<script lang="ts">
  import { mmss } from "@mod/time";
  import { Icon, Pause, Play, SpeakerWave, SpeakerXMark } from "svelte-hero-icons";

  interface Props {
    src: string;
  }

  let { src }: Props = $props();

  let audio = $state({
    currentTime: 0,
    duration: 0,
    muted: false,
    paused: true,
    src,
    volume: 1.0,
  });

  let pos = $derived(mmss(audio.currentTime));
</script>

<audio
  bind:currentTime={audio.currentTime}
  bind:duration={audio.duration}
  bind:muted={audio.muted}
  bind:paused={audio.paused}
  bind:volume={audio.volume}
  src={audio.src}
></audio>

<div class="flex items-center space-x-12">
  <button
    class="btn btn-circle btn-primary"
    onclick={() => {
      audio.paused = !audio.paused;
    }}
    aria-label="playPause"
  >
    {#if audio.paused}
      <Icon src={Play} solid class="size-6" aria-hidden="false" aria-label="play" role="img" />
    {:else}
      <Icon src={Pause} solid class="size-6" aria-hidden="false" aria-label="pause" role="img" />
    {/if}
  </button>

  <div class="flex flex-grow items-center space-x-2 font-mono">
    <div>{pos}</div>
    <input
      class="range"
      max={audio.duration}
      min="0"
      onchange={(e) => {
        audio.muted = false;
        audio.currentTime = parseFloat(e.currentTarget.value);
      }}
      oninput={(e) => {
        audio.muted = true;
        audio.currentTime = parseFloat(e.currentTarget.value);
      }}
      step="0.1"
      type="range"
      value={audio.currentTime}
    />
    <div>{mmss(audio.duration)}</div>
  </div>

  <div class="flex items-center">
    <button
      class="btn btn-circle btn-xs"
      onclick={() => {
        audio.muted = !audio.muted;
      }}
    >
      {#if audio.muted}
        <Icon src={SpeakerXMark} solid class="size-6" aria-hidden="false" aria-label="unmute" role="img" />
      {:else}
        <Icon src={SpeakerWave} solid class="size-6" aria-hidden="false" aria-label="mute" role="img" />
      {/if}
    </button>

    <input type="range" min="0" max="1" step="0.01" bind:value={audio.volume} class="range range-xs w-32" />
  </div>
</div>
