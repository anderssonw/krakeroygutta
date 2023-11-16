<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import SelectCardModal from '$lib/components/fantasy/SelectCardModal.svelte';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import FantasyCard from '$lib/components/fantasy/FantasyCard.svelte';
	import FantasyCardMobile from '$lib/components/fantasy/FantasyCardMobile.svelte';
	import currencyImg from '$lib/assets/currency.png';
	import { enhance } from '$app/forms';
	import { isSeasonActive, isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';
	import { getTotalPointsForPlayers, mapTeamStats } from '$lib/shared/MatchStatsFunctions';

	// Get server data
	export let data: PageData;
	const { fantasyTeam, allPlayers, season, allMatches, teamStats } = data;
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);
	$: playersWithPoints = getTotalPointsForPlayers(matches);

	export let form: ActionData;

	$: fantasyForm = {
		captainId: fantasyTeam?.captain_id || -1,
		selectedCardPosition: -1,
		players: fillFantasyFormPlayers(allPlayers ?? [], fantasyTeam?.player_ids ?? []),
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

	const fillFantasyFormPlayers = (allPlayers: FullPlayer[], currentPlayers: number[]): (FullPlayer | null)[] => {
		const maxPlayerCount = 4;

		let formPlayers: (FullPlayer | null)[] = [];

		if (currentPlayers && currentPlayers.length > 0) {
			let currentPlayerCount = currentPlayers.length;

			currentPlayers.forEach((player_id) => {
				let mapPlayer = allPlayers.find((player) => player.player_id == player_id);
				if (mapPlayer) formPlayers.push(mapPlayer);
			});

			for (let i = 0; i < maxPlayerCount - currentPlayerCount; i++) {
				formPlayers.push(null);
			}

			return formPlayers;
		} else {
			for (let i = 0; i < maxPlayerCount; i++) {
				formPlayers.push(null);
			}
		}

		return formPlayers;
	};
</script>

{#if allPlayers && season}
	<SelectCardModal bind:fantasyForm players={allPlayers} {season} />

	{#if season}
		<form class="structure" method="POST" use:enhance>
			<h1>Ditt fantasylag</h1>
			{#if form}
				<p>Noe gikk galt:</p>
				{#each form.formHints as hint}
					<p class="my-0 text-red-400">{hint}</p>
				{/each}
			{/if}

			{#if isSeasonPastDeadline(season)}
				<p>Deadlinen er nå forbi, så du vil ikke kunne redigere laget ditt</p>
			{/if}

			<div class="w-full flex flex-col space-y-4 tablet:flex-row justify-between items-center tablet:items-end px-8 tablet:px-0">
				<div class="w-full tablet:w-1/3">
					<div class="tablet:w-2/3">
						<label for="teamName" class="block mb-1"><h5>Lagnavn</h5></label>
						<input
							name="teamName"
							type="text"
							id="teamName"
							class={`input w-full ${isSeasonPastDeadline(season) ? 'cursor-not-allowed' : ''}`}
							placeholder="Gutta krutt"
							value={fantasyForm.teamName}
							required
							disabled={isSeasonPastDeadline(season)}
						/>
					</div>
				</div>
				<div class="w-full tablet:w-1/3 flex flex-row justify-center items-center gap-2">
					<h1 class="text-yellow-500">{currentCash}</h1>
					<div class="w-6 tablet:w-6 laptop:w-8">
						<img src={currencyImg} alt="currency" />
					</div>
				</div>
				<div class="w-full tablet:w-1/3 flex justify-center tablet:justify-end">
					<button
						class={`font-bold py-2 px-4 rounded-md w-2/3 ${
							isSeasonPastDeadline(season) ? 'cursor-not-allowed bg-secondary-color-dark' : 'bg-green-500'
						}`}>Lagre laget</button
					>
				</div>
			</div>

			<div
				class="relative w-full tablet:h-192 hidden tablet:block bg-cover bg-no-repeat bg-center bg-[url('$lib/assets/fantasy/fantasy_field_large.png')]"
			>
				{#each fantasyForm.players as player, position}
					<FantasyCard bind:fantasyForm {player} {position} {season} {playersWithPoints} />
				{/each}
			</div>

			<div
				class="relative w-full block tablet:hidden py-8 bg-cover bg-no-repeat bg-center bg-[url('$lib/assets/fantasy/fantasy_field_small.png')]"
			>
				<div class="grid grid-cols-2 gap-y-8">
					{#each fantasyForm.players as player, position}
						<FantasyCardMobile bind:fantasyForm {player} {position} {season} {playersWithPoints}/>
					{/each}
				</div>
			</div>

			{#each fantasyForm.players as player}
				{#if player}
					<input name="playerIds" bind:value={player.player_id} type="hidden" />
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
