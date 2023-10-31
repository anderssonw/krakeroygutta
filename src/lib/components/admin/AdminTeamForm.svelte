<script lang="ts">
	import { enhance } from '$app/forms';
	import TextField from '../common/TextField.svelte';
	import DropdownMenu from './dropdownMenu.svelte';
	import PlusIcon from 'virtual:icons/typcn/plus';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import type { DropdownOption } from '$lib/types/newTypes';

	export let playerIds: (DropdownOption | null)[] = [];
	export let availablePlayers: DropdownOption[];
	export let seasonId: number | undefined = undefined;
	export let teamId: number | undefined = undefined;
	export let formSubmitSuccess: boolean = false;
	export let teamName: string | undefined = undefined;
	export let teamColor: string | undefined = undefined;

	const getPlayerIdsToString = (playersInserted: (DropdownOption | null)[]) => {
		let playerIds: number[] = [];
		playersInserted.forEach((player) => {
			if (!player) return;

			playerIds.push(player.id);
		});

		return playerIds.join(',');
	};

	$: playerIdsInForm = getPlayerIdsToString(playerIds);
</script>

<div class="form-structure">
	<TextField header="Lagnavn" label="name" type="text" placeholder="Gutta G" bind:value={teamName} />
	<TextField header="Lagfarge" label="color" type="text" placeholder="Svart" bind:value={teamColor} />
	<div class="flex flex-col items-center w-full">
		<p class="text-md">Spillere</p>
		{#each playerIds as player, i}
			<div class="w-full my-2 flex flex-row items-center">
				<DropdownMenu option={`spiller ${i + 1}`} bind:options={availablePlayers} bind:selectedOption={player} />
				<button
					class="p-2"
					type="button"
					on:click={() => {
						playerIds.splice(i, 1);
						playerIds = playerIds;
					}}
				>
					<DeleteIcon />
				</button>
			</div>
		{/each}
		<button
			type="button"
			class="mt-2 button w-6 h-6 rounded-full bg-green-700"
			on:click={() => {
				if (availablePlayers.length === 0) {
					alert('Det er ikke flere ledige spillere');
				} else {
					playerIds.push(null);
					playerIds = playerIds;
				}
			}}
		>
			<PlusIcon class="mx-auto" />
		</button>
	</div>
	<input hidden type="number" name="season_id" bind:value={seasonId} />
	<input hidden type="text" name="id" bind:value={teamId} />
	<input hidden type="text" name="players" bind:value={playerIdsInForm} />
	<button type="submit" class="btn bg-green-400">{teamId ? 'Oppdater' : 'Legg til'}</button>
	{#if formSubmitSuccess}
		<p class="text-green-400">Lag lagt til</p>
	{/if}
</div>
