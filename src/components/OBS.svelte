<script type="ts">
  import { onMount } from "svelte";
  import { Recorder } from "@components/capture/obs";

  let { url = "" } = $props();

  let out = $state("");
  const recorder = Recorder();

  onMount(async () => {
    const u = new URL(url);
    await recorder.init(u.origin, u.password);
  });
</script>

<button
  class="btn"
  onclick={async () => {
    await recorder.start();
    setTimeout(async () => {
      out = await recorder.stop();
    }, 1000);
  }}
>
  RECORD
</button>

<div>Output: {out}</div>
