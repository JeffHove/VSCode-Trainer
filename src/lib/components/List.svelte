<script lang="ts">
  import { selectedTaskList } from "$lib/refs.svelte";

  const taskLists = ["Cursor Control", "Editing", "Environment Management"];
</script>

<div>
  {#each taskLists as taskList (taskList)}
    <input bind:group={selectedTaskList.v} class="pointer-events-none fixed opacity-0" id={taskList} name="algorithm" type="radio" value={taskList} />
    <label class="bg-secondary-color cursor-pointer px-2 py-1 transition-colors hover:text-primary hover:bg-white" for={taskList}>{taskList}</label>
  {/each}
</div>

<style>
  input[type="radio"]:checked + label {
    background-color: white;
    color: var(--primary-color);
  }
</style>
