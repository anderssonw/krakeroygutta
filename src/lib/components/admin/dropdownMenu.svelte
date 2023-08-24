<!-- <script lang="ts">
	import type { DropdownOption } from "$lib/types/newTypes";

    export let option: string;
    export let options: any[];
    export let selectedOption: DropdownOption;

    let showOptions: boolean = false;
    const handleSelection = (option: any) => {
        selectedOption = {
            id: option.pid ?? option.sid ?? option.tid,
            name: option.name
        }
        showOptions = false;
    }
    const removeSelection = (option: any) => {
        selectedOption = {} as DropdownOption;
    }
</script>

<div class="relative">
    
    {#if selectedOption.id}
        {selectedOption.name} <button class="btn" on:click={removeSelection}>X</button>
    {:else}
        <button type="button" class="btn" on:click={() => showOptions = !showOptions}>
            Select {option}
        </button>
    {/if}

    {#if showOptions}
        <div class="absolute top-12 bg-primary-color w-48 p-2 rounded-md z-10">
            {#each options as opt}
                <p class="rounded-sm hover:bg-primary-color-light hover:cursor-pointer" on:mouseup={() => handleSelection(opt)}>{opt.name}</p>
            {/each}
        </div>
    {/if}
</div> -->
