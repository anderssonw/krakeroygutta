<script lang="ts">
	import type { DropdownOption } from '$lib/types/newTypes';

	export let header: string;
	export let options: DropdownOption[];
	export let selectedOption: DropdownOption | null;
    export let optionPlacement: 'left' | 'right';

	let showOptions: boolean = false;
	const handleSelection = (option: DropdownOption) => {
		selectedOption = {
			id: option.id,
			name: option.name
		};
		showOptions = false;
	};
    const isSelectedOption = (option: DropdownOption) => {
        return option.id === selectedOption?.id;
    }
    
    const getOptionPlacement = () => {
        if (optionPlacement === 'right') {
            return 'top-[100%] left-0'
        }

        if (optionPlacement === 'left') {
            return 'top-[100%] right-0'
        }

        return ''
    }
</script>

<div class="relative">
	<div class="cursor-pointer p-4 border-b-2" on:click={() => (showOptions = !showOptions)}><h5>{header}</h5></div>


    {#if showOptions}
        <div class="absolute {getOptionPlacement()} w-40 bg-secondary-color-light flex flex-col">
            {#each options as opt}
                <button
                    class="hover:bg-secondary-color-dark hover:cursor-pointer p-2 {isSelectedOption(opt) ? 'bg-tertiary-color-light' : ''}"
                    on:mouseup={() => handleSelection(opt)}
                >
                    <h5 class="text-primary-color-dark">
                        {opt.name}
                    </h5>
                </button>
            {/each}
        </div>
    {/if}
</div>