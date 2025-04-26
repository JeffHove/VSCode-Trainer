<script lang="ts">
  import ImportJSON from "$lib/components/ImportJSON.svelte";
  import List from "$lib/components/List.svelte";
  import { enterPressed, isRandomized, os } from "$lib/refs.svelte";
</script>

{#if !enterPressed.v}
  <ImportJSON />
  <header class="flex flex-col items-center justify-center gap-1">
    <List />
    <div>
      <label for="os">OS:</label>
      <select id="os" class="text-primary bg-white px-1 text-center" bind:value={os.v}>
        <option value="Windows">Windows</option>
        <option value="macOS">macOS</option>
        <option value="Linux">Linux</option>
      </select>
    </div>
    <div>
      <label for="randomized">Randomized:</label>
      <input bind:checked={isRandomized.v} id="randomized" type="checkbox">
    </div>
  </header>
{:else}
  <div class="absolute left-2">
    <button onclick={() => { enterPressed.v = false; }}>Back (b b)</button>
  </div>
{/if}
