<script lang="ts">
	import CloseIcon from 'virtual:icons/material-symbols/close';
	import type { DropdownOption } from '$lib/types/newTypes';
	/**
	 * Header above input field, used as helper text
	 */
	export let header: string | undefined = undefined;
	/**
	 * The option that is being chosen. Only used to help user know what they are picking
	 */
	export let option: string;
	/**
	 * The different options to choose from
	 */
	export let options: DropdownOption[];
	/**
	 * The currently selected option
	 */
	export let selectedOption: DropdownOption | null;
	let showOptions: boolean = false;
	const handleSelection = (option: DropdownOption) => {
		selectedOption = {
			id: option.id,
			name: option.name
		};
		showOptions = false;
	};
	const removeSelection = () => {
		selectedOption = null;
	};
</script>

<div class="relative w-full">
	{#if header}
		<div class="block mb-1"><h5>{header}</h5></div>
	{/if}
	{#if selectedOption}
		<div class="flex flex-row items-center justify-between rounded-lg border-2 pl-4">
			<p>{selectedOption.name}</p>
			<button class="btn text-center rounded-md ml-8" on:click={removeSelection}><CloseIcon /></button>
		</div>
	{:else}
		<button type="button" class="btn w-full" on:click={() => (showOptions = !showOptions)}>
			Velg {option}
		</button>
	{/if}

	{#if showOptions}
		<div class="absolute bg-primary-color w-full p-2 rounded-md z-10 flex flex-col">
			{#each options as opt}
				<button
					class="rounded-sm hover:bg-primary-color-light hover:cursor-pointer py-2 border-b-2 rounded-b-none last:border-none"
					on:mouseup={() => handleSelection(opt)}
				>
					<h5>
						{opt.name}
					</h5>
				</button>
			{/each}
		</div>
	{/if}
</div>
