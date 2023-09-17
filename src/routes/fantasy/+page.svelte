<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import SelectCardModal from '$lib/components/fantasy/SelectCardModal.svelte';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import FantasyCard from '$lib/components/fantasy/FantasyCard.svelte';
	import TextField from '$lib/components/common/TextField.svelte';
	import FantasyCardMobile from '$lib/components/fantasy/FantasyCardMobile.svelte';

	// Get server data
	export let data: PageData;
	const { fantasyTeam, fantasyTeamPlayers, allPlayers, season } = data;

	export let form: ActionData;

	$: fantasyForm = {
		captainId: fantasyTeam?.captain_id || -1,
		selectedCardPosition: -1,
		players: fillFantasyFormPlayers(fantasyTeamPlayers),
		teamName: fantasyTeam?.name || ''
	} satisfies FantasyForm;

	$: currentCash = calculateCurrentCash(fantasyForm.players);

	const calculateCurrentCash = (players: (FullPlayer | null)[]) => {
		if (season) {
			return (
				season?.starting_currency -
				players.reduce((accumulator, player) => {
					if (!player) return accumulator;

					return accumulator + player?.price;
				}, 0)
			);
		} else {
			return -1;
		}
	};

	const fillFantasyFormPlayers = (currentPlayers: FullPlayer[] | null): (FullPlayer | null)[] => {
		const maxPlayerCount = 4;

		let formPlayers: (FullPlayer | null)[] = [];

		if (currentPlayers && currentPlayers.length > 0) {
			let currentPlayerCount = currentPlayers.length;

			formPlayers = formPlayers.concat(currentPlayers);

			for (let i = 0; i < maxPlayerCount - currentPlayerCount; i++) {
				formPlayers.push(null);
			}

			return formPlayers;
		}

		for (let i = 0; i < maxPlayerCount; i++) {
			formPlayers.push(null);
		}

		return formPlayers;
	};
</script>

{#if allPlayers && season}
	<SelectCardModal bind:fantasyForm={fantasyForm} players={allPlayers} season={season} />

	{#if season}
		<form class="structure" method="POST">
			<h1>Ditt fantasylag</h1>
			{#if form}
				{#each form.formHints as hint}
					<p>{hint}</p>
				{/each}
			{/if}

			<div class="w-full flex flex-col space-y-4 tablet:flex-row justify-between items-center tablet:items-end px-8 tablet:px-0">
				<div class="w-full tablet:w-1/3">
					<div class="tablet:w-2/3">
						<label for="teamName" class="block mb-1"><h5>Lag navn</h5></label>
						<input name="teamName" type="text" id="teamName" class="input w-full" placeholder="Gutta krutt" value={fantasyForm.teamName} required />
					</div>
				</div>
				<div class="w-full tablet:w-1/3 flex flex-col items-center"> 
					<h1 class="text-yellow-500">{currentCash},-</h1> 
				</div>
				<div class="w-full tablet:w-1/3 flex justify-center tablet:justify-end">
					<button class="btn w-2/3 bg-green-500"> Lagre laget </button>
				</div>
			</div>

			<div class="relative w-full tablet:h-192 hidden tablet:block bg-primary-color-light">
				{#each fantasyForm.players as player, position}
					<FantasyCard bind:fantasyForm={fantasyForm} player={player} position={position} season={season} />
				{/each}
			</div>

			<div class="relative w-full block tablet:hidden bg-primary-color-light py-8">
				<div class="grid grid-cols-2 gap-y-8">
				{#each fantasyForm.players as player, position}
					<FantasyCardMobile bind:fantasyForm={fantasyForm} player={player} position={position} season={season} />
				{/each}
				</div>
			</div>

			{#each fantasyForm.players as player, position}
				{#if player}
					<input name="playerIds" bind:value={player.id} type="hidden" />
				{/if}
			{/each}

			<div class="relative w-full bg-primary-color block tablet:hidden" />

			<input name="captainId" bind:value={fantasyForm.captainId} type="hidden" />
			<input name="currencyLeft" bind:value={currentCash} type="hidden" />
		</form>
	{:else}
		<h2>Ingen aktiv sesong</h2>
	{/if}
{/if}
