<script lang="ts">
	import type { DropdownOption } from "$lib/types/newTypes";

    export let title: string;
    export let option: string;
    export let options: DropdownOption[];
    export let selectedOption: DropdownOption;

    let showOptions: boolean = false;
    const handleSelection = (option: DropdownOption) => {
        selectedOption = {
            id: option.id,
            name: option.name
        }
        showOptions = false;
    }
    const removeSelection = () => {
        selectedOption = {} as DropdownOption;
    }
</script>

<div class="relative w-full">
    {#if selectedOption.id}
        <div class="block mb-1"><h5>{title}</h5></div>
        <div class="flex flex-row items-center rounded-lg border-2 pl-4">
            <p class="w-9/12">{selectedOption.name}</p>
            <button class="btn w-3/12" on:click={removeSelection}>X</button>
        </div>
    {:else}
        <div class="block mb-1"><h5>{title}</h5></div>
        <button type="button" class="btn w-full" on:click={() => showOptions = !showOptions}>
            Velg {option}
        </button>
    {/if}

    {#if showOptions}
        <div class="absolute bg-primary-color w-full p-2 rounded-md z-10">
            {#each options as opt}
                <h5 class="rounded-sm hover:bg-primary-color-light hover:cursor-pointer py-2 border-b-2" on:mouseup={() => handleSelection(opt)}>{opt.name}</h5>
            {/each}
        </div>
    {/if}
</div> 
