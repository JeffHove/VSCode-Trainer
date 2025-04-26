<script lang="ts">
  import { os } from "$lib/refs.svelte";
  import { shortcuts } from "$lib/shortcuts";

  const search2DArray = (array: string[][], target: string): null | number => {
    for (let row = 0; row < array.length; row++) {
      for (let col = 0; col < array[row].length; col++) if (array[row][col] === target) return row;
    }

    return null;
  };

  let files: FileList | undefined = $state();

  const onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Remove single-line and multi-line comments
          const fileContent = (reader.result as string).replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//gm, "");

          let keyBindings: { command: string; key: string }[] = JSON.parse(fileContent);

          const keys = [...shortcuts.keys()];
          const commands = [...shortcuts.values()].map(value => value.commands);
          for (let i = 0; i < keyBindings.length; i++) {
            const commandIndex = search2DArray(commands, keyBindings[i].command);
            if (commandIndex !== null) {
              switch (os.v) {
                case "Linux": shortcuts.get(keys[commandIndex])!.linux.push(keyBindings[i].key); break;
                case "macOS": shortcuts.get(keys[commandIndex])!.mac.push(keyBindings[i].key); break;
                case "Windows": shortcuts.get(keys[commandIndex])!.win.push(keyBindings[i].key); break;
              }
            }
          }

          alert("Custom keybindings added.");
        }
        catch (error) {
          console.log(error);
          alert("It didn't work, sorry. Check console.");
        }
      };

      reader.readAsText(file);
    }
  };
</script>

<label class="absolute left-2 cursor-pointer" for="file-upload">Import keybindings.json</label>
<input accept=".json" bind:files class="pointer-events-none fixed opacity-0" id="file-upload" {onchange} type="file" />
