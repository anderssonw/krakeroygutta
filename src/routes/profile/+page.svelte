<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import { accordion } from '$lib/hooks/accordion';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';
	import type { ActionData, PageData } from './$types';
	import ArrowUpIcon from 'virtual:icons/ph/arrow-up';
	import ArrowDownIcon from 'virtual:icons/ph/arrow-down';
	import { isSeasonActive } from '$lib/shared/SeasonFunctions';
	import Dancer from '$lib/components/common/Dancer.svelte';

	// Get server data
	export let data: PageData;
	export let form: ActionData;
	$: ({ player, seasons, user, season } = data);

	$: playerSeasonsWithCardDate = (): FullPlayer[] => {
		if (!player) return [];

		// Gjøre denne litt mer robust, sortering er kun på sesongens ID nå
		const playerSeasons = player.players_seasons.sort((a, b) => b.season_id - a.season_id);

		return playerSeasons.map((playerSeason) => {
			return {
				player_id: player.id,
				name: player.name,
				image: player.image,
				attack: playerSeason.attack,
				defence: playerSeason.defence,
				morale: playerSeason.morale,
				physical: playerSeason.physical,
				price: playerSeason.price,
				skill: playerSeason.skill,
				inform_image: playerSeason.inform_image,
				season_id: playerSeason.season_id
			} as FullPlayer;
		});
	};

	$: sortedSeasons =
		seasons?.sort((a, b) => {
			return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
		}) || [];

	$: getCurrentSeasonCard = () => {
		const currentSeason = sortedSeasons.at(0);

		if (!currentSeason) return null;

		return {
			player: playerSeasonsWithCardDate().find((playerSeason) => {
				return playerSeason.season_id === currentSeason.id;
			}),
			season: currentSeason
		};
	};

	$: currentSeasonCard = getCurrentSeasonCard();

	$: getOtherSeasonCards = () => {
		const otherSeasons = sortedSeasons.slice(1);

		return otherSeasons.map((season) => {
			return {
				player: playerSeasonsWithCardDate().find((playerSeason) => {
					return playerSeason.season_id === season.id;
				}),
				season
			};
		});
	};

	$: otherSeasonCards = getOtherSeasonCards();

	let openSeasons = false;
</script>

<div class="flex flex-col items-center py-8">
	{#await player}
		<Dancer />
	{:then player}
		{#if user}
			<div class="flex flex-col items-center space-y-4">
				<h1>Hei {user.nickname}!</h1>
				{#if player && season}
					{#if isSeasonActive(season)}
						<h2>Spillerkort for sesong - {season.name}</h2>
						{#if currentSeasonCard?.player}
							<Card card_size={CARD_SIZE.LARGE} player={currentSeasonCard.player} />
						{:else}
							<Card player={null} card_size={CARD_SIZE.LARGE} />
							<h3>Skal du ikke være med i år?!</h3>
						{/if}
					{/if}

					{#if otherSeasonCards}
						<button class="border-b-2" on:click={() => (openSeasons = !openSeasons)}>
							<div class="text-lg flex flex-row align-middle py-4 gap-2">
								Se tidligere sesonger
								{#if openSeasons}
									<ArrowUpIcon />
								{:else}
									<ArrowDownIcon />
								{/if}
							</div>
						</button>
						<div class="flex flex-col gap-8" use:accordion={openSeasons}>
							{#each otherSeasonCards as playerSeason}
								{#if playerSeason.player}
									<div class="flex flex-col gap-4 items-center justify-end">
										<h3 class="text-s w-60 text-center">{playerSeason.season.name}</h3>
										<Card card_size={CARD_SIZE.MEDIUM} player={playerSeason.player} />
									</div>
								{/if}
							{/each}
						</div>
					{/if}
				{:else}
					<p>Du har ikke en spiller knyttet til profilen din. Kontakt Magnus eller William for å gjøre dette.</p>
				{/if}
			</div>
		{/if}
	{/await}
	<form class="py-4" method="POST">
		<button class="btn">Logg ut</button>
	</form>
</div>

{#if form?.errors}
	{#each Object.values(form?.errors) as error}
		<p class="text-red-700 pa-0 ma-0">{error}</p>
	{/each}
{/if}
