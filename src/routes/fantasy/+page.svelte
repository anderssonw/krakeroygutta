<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import SelectCardModal from '$lib/components/fantasy/SelectCardModal.svelte';
	import CardSmall from '$lib/components/fantasy/CardSmall.svelte';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';

	// Get server data
	export let data: PageData;
	const { session, fantasyTeam, fantasyTeamPlayers, allPlayers, season } = data;

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});

	$: fantasyForm = {
		captainId: fantasyTeam?.captain_id || -1,
		selectedCardPosition: -1,
		players: fillFantasyFormPlayers(fantasyTeamPlayers),
		teamName: fantasyTeam?.name || 'placeholder'
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

{#if session && allPlayers && season}
	<SelectCardModal bind:fantasyForm players={allPlayers} />

	{#if season}
		<form class="structure" method="POST">
			<h2>Ditt Fantasylag</h2>
			<input class="input" name="name" bind:value={fantasyForm.teamName} type="text" placeholder="Ditt Lagnavn" />
			<h3>Penger: {currentCash}</h3>
			<button class="btn"> Lagre Laget Ditt </button>

			<div class="relative flex flex-wrap w-full hidden tablet:block">
				<img src="/fantasy/Field.png" alt="field" />
				{#each fantasyForm.players as player, position}
					<div class="absolute player-{position}">
						{#if !player}
							<div class="small-card" on:mouseup={() => (fantasyForm.selectedCardPosition = position)}>
								<img src="/cards/empty.png" alt="card" />
							</div>
							<!-- <input name="playerIds" value={-1} type="hidden" /> -->
						{:else}
							<CardSmall bind:fantasyForm {player} {position} />
							<input name="playerIds" bind:value={player.id} type="hidden" />
						{/if}
					</div>
				{/each}
			</div>

			<div class="relative w-full bg-primary-color block tablet:hidden" />

			<input name="captainId" bind:value={fantasyForm.captainId} type="hidden" />
			<input name="currencyLeft" bind:value={currentCash} type="hidden" />
		</form>
	{:else}
		<h2>Currently no active season</h2>
	{/if}
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
