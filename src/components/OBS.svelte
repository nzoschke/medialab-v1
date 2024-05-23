<script lang="ts">
  import { onMount } from "svelte";
  import { Recorder } from "@components/capture/obs";

  let { url = "" } = $props();
  let { origin, password } = new URL(url);

  let init = $state(false);
  const logs = $state<string[]>(["OBS Recorder"]);

  let out = $state("");

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
    await recorder.start();
    setTimeout(async () => {
      out = await recorder.stop();
    }, 1000);
  };

  onMount(async () => {
    const u = new URL(url);
    await recorder.init(origin, password);
  });
</script>

{#if init}
  <div>Connected to OBS with <span class="font-mono">{origin}</span></div>
{:else}
  <div>Error connecting. Start with <span class="font-mono">OBS --use-fake-ui-for-media-stream</span></div>
{/if}

<button
  class="btn {init ? 'btn-primary' : 'btn-disabled'}"
  onclick={() => {
    record();
  }}
>
  RECORD
</button>

{#if out}
  <div>Output: {out}</div>
{/if}
