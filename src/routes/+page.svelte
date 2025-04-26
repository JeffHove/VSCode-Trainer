<script lang="ts">
  import { codeToKey } from "$lib/codeToKey";
  import Funding from "$lib/components/Funding.svelte";
  import Header from "$lib/components/Header.svelte";
  import { enterPressed, isRandomized, os, selectedTaskList } from "$lib/refs.svelte";
  import { shortcuts } from "$lib/shortcuts";

  import "../app.css";

  // #region Utils
  const getRandomIntInclusive = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const isModifierKey = (code: string) => {
    const modifierKeys = ["ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight"];
    return modifierKeys.includes(code);
  };
  // #endregion

  let numNonModifierKeysPressed = 0;
  let randomTaskIndex = $state(0);
  let isLoading = $state(false);
  let result = $state("");
  let heldKeys = [""];
  let time = 0;

  const filteredEntries = $derived([...shortcuts.entries()].filter(([, value]) => value.list === selectedTaskList.v));
  const values = $derived(filteredEntries.map(([, value]) => value));
  const keys = $derived(filteredEntries.map(([key]) => key));

  const randomTask = $derived.by(() => {
    let _combos: string[] = [];

    switch (os.v) {
      case "Linux": _combos = values[randomTaskIndex].linux; break;
      case "macOS": _combos = values[randomTaskIndex].mac; break;
      case "Windows": _combos = values[randomTaskIndex].win; break;
    }

    return { combos: _combos, key: keys[randomTaskIndex], src: values[randomTaskIndex].src };
  });
  const isSolved = $derived(randomTask.combos.includes(result));

  const styleHeldKeys = (code: string) => {
    const _result: string[] = [];

    if (heldKeys.includes("ControlLeft") || heldKeys.includes("ControlRight")) _result.push("ctrl");
    if (heldKeys.includes("ShiftLeft") || heldKeys.includes("ShiftRight")) _result.push("shift");
    if (heldKeys.includes("AltLeft") || heldKeys.includes("AltRight")) _result.push("alt");
    if (heldKeys.includes("MetaLeft") || heldKeys.includes("MetaRight")) {
      switch (os.v) {
        case "Linux": _result.push("meta"); break;
        case "macOS": _result.push("cmd"); break;
        case "Windows": _result.push("win"); break;
      }
    }
    if (!isModifierKey(code)) _result.push(codeToKey.get(code)!);

    return _result.join("+");
  };

  const reset = () => {
    numNonModifierKeysPressed = 0;
    heldKeys = [];
    result = "";
  };

  const onkeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === "Enter") enterPressed.v = true;
    if (!enterPressed.v) return;

    e.preventDefault();
    if (e.repeat) return;

    clearTimeout(time);
    time = setTimeout(reset, 500);

    if (!isModifierKey(e.code)) numNonModifierKeysPressed++;

    heldKeys.push(e.code);

    if (numNonModifierKeysPressed < 2) result = styleHeldKeys(e.code);
    else if (numNonModifierKeysPressed === 2) result = result + " " + styleHeldKeys(e.code);
  };

  const onkeyup = (e: KeyboardEvent) => { heldKeys = heldKeys.filter(code => code !== e.code); };

  const onSolved = () => {
    reset();
    if (isRandomized.v) {
      const currentTaskIndex = randomTaskIndex;
      while (currentTaskIndex === randomTaskIndex) randomTaskIndex = getRandomIntInclusive(0, filteredEntries.length - 1);
    }
    else {
      randomTaskIndex === filteredEntries.length - 1 ? randomTaskIndex = 0 : randomTaskIndex++;
    }
  };

  // Need this b/c otherwise "Uncaught TypeError: $.get(...)[$.get(...)] is undefined"
  // when switching from a big list to a small list and randomTaskIndex is out of bounds.
  $effect(() => { if (!enterPressed.v) randomTaskIndex = 0; });

  $effect(() => { if (isSolved) onSolved(); });

  $effect(() => {
    if (result === "s s") onSolved();
    if (result === "b b") enterPressed.v = false;
  });
</script>

<Header />

<Funding />

<main class="flex flex-1 flex-col items-center justify-center gap-2">
  {#if !enterPressed.v}
    <button class="cursor-pointer border-2 border-white px-2 py-1 text-3xl font-bold" onclick={() => { enterPressed.v = true; }}>Ctrl + Enter</button>
  {:else}
    <div>{result}</div>
    <div>{randomTask.key}</div>
    <video autoplay class="w-1/2" class:isLoading loop muted oncanplay={() => { isLoading = false; }} onloadstart={() => { isLoading = true; }} src={randomTask.src}></video>
    {#if isLoading}
      <div class="spinner"></div>
    {/if}
    <div class="hover:bg-primary bg-white">{randomTask.combos.map(combo => `"${combo}"`).join(" ")}</div>
    <button onclick={onSolved}>Skip (s s)</button>
  {/if}
</main>

<svelte:window onblur={() => { heldKeys = []; }} {onkeydown} {onkeyup}></svelte:window>

<style>
  .isLoading {
    display: none;
  }

  .spinner {
    width: 56px;
    height: 56px;
    border: 11.2px #ffffff double;
    border-left-style: solid;
    border-radius: 50%;
    animation: spinner-aib1d7 0.75s infinite linear;
  }

  @keyframes spinner-aib1d7 {
    to {
      transform: rotate(360deg);
    }
  }
</style>
