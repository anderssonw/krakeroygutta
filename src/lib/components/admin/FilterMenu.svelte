<script lang="ts">
	import type { FilterOption } from '$lib/types/newTypes';
    import ArrowUpIcon from 'virtual:icons/ph/arrow-up';
    import ArrowDownIcon from 'virtual:icons/ph/arrow-down';
	import { onDestroy, onMount } from 'svelte';

	export let header: string;
	export let options: FilterOption[];
	export let selectedOption: FilterOption | null;
    export let optionPlacement: 'left' | 'right';
    export let sorting: boolean;

	let showOptions: boolean = false;

	const handleSelection = (option: FilterOption) => {
        if (sorting && selectedOption) {
            if (selectedOption.id === option.id) {
                selectedOption.desc = !selectedOption.desc;
            } else {
                selectedOption = {
                    id: option.id,
                    name: option.name,
                    desc: option.desc
                };
            }
        } else {
            selectedOption = {
                id: option.id,
                name: option.name,
                desc: option.desc
            };
        }
		showOptions = false;
	};
    const isSelectedOption = (option: FilterOption) => {
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

    // Function to handle clicks outside the component
    let componentElement: HTMLElement | null = null;
    function handleClickOutside(event: MouseEvent): void {
        if (componentElement && !componentElement.contains(event.target as Node)) {
            showOptions = false;
        }
    }

    // Add event listener when the component is mounted
    onMount(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            document?.addEventListener('click', handleClickOutside);
        }
    });

    // Remove event listener when the component is destroyed
    onDestroy(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') { 
            document?.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<div class="relative" bind:this={componentElement}>
	<div class="cursor-pointer px-12 py-4 border-b-2" on:click={() => (showOptions = !showOptions)}><h5>{header}</h5></div>


    {#if showOptions}
        <div class="absolute {getOptionPlacement()} w-60 bg-secondary-color-light flex flex-col">
            {#each options as opt}
                <button
                    class="hover:bg-secondary-color-dark hover:cursor-pointer py-4 {isSelectedOption(opt) ? 'bg-tertiary-color-light' : ''}"
                    on:mouseup={() => handleSelection(opt)}
                >
                <div class="flex items-center justify-center gap-2">
                    <h5 class="text-primary-color-dark">
                        {opt.name}
                    </h5>
                    {#if isSelectedOption(opt) && sorting}
                        {#if selectedOption?.desc}
                            <ArrowDownIcon class="text-primary-color" />
                        {:else}
                            <ArrowUpIcon class="text-primary-color" />
                        {/if}
                    {/if}
                </div>
                </button>
            {/each}
        </div>
    {/if}
</div>