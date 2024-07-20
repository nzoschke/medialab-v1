<script lang="ts">
  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<button class="btn btn-primary" onclick={increment}>
  clicks: {count}
</button>
