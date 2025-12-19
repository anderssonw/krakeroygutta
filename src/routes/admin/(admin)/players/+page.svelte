<script lang="ts">
	import type { FullPlayer, StandardPlayer, StandardPlayerSeason } from '$lib/types/newTypes';
	import { afterUpdate } from 'svelte';
	import { isSeasonActive, isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';
	import type { PageData } from './$types';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import Card from '$lib/components/cards/Card.svelte';
	import CreateCard from '$lib/components/cards/CreateCard.svelte';
	import ArrowUpIcon from 'virtual:icons/ph/arrow-up';
	import ArrowDownIcon from 'virtual:icons/ph/arrow-down';

	// Get server data
	export let data: PageData;

	interface PlayerSeasonCards {
		player: StandardPlayer;
		currentCard: FullPlayer | null;
		previousCard: FullPlayer | null;
	}

	$: ({ allPlayers, playersPerSeason, season, previousSeason } = data);

	let openSeasons = false;

	$: seasonIsActive = (season && isSeasonActive(season) && !isSeasonPastDeadline(season)) ?? false;
	$: allPlayerSeasonCards = findCardsForPlayers(allPlayers ?? [], playersPerSeason ?? []);
	$: currentSeasonCards = allPlayerSeasonCards
		.map((cards) => cards.currentCard)
		.filter((card) => card !== null)
		.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
	$: previousSeasonCards = allPlayerSeasonCards
		.map((cards) => cards.previousCard)
		.filter((card) => card !== null)
		.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

	const mapToFullPlayer = (player: StandardPlayer, playerCard: StandardPlayerSeason) => {
		const fullPlayer: FullPlayer = {
			...player,
			...playerCard,
			team_color: null,
			team_id: null
		};
		return fullPlayer;
	};
	const findCardsForPlayers = (players: StandardPlayer[], playerCards: StandardPlayerSeason[]): PlayerSeasonCards[] => {
		const playerSeasonCards: PlayerSeasonCards[] = [];

		players.forEach((player) => {
			const findCards = playerCards.filter((card) => card.player_id === player.id);
			if (findCards.length > 0) {
				const currentCard = findCards.find((card) => card.season_id === season?.id);
				const previousCard = findCards.find((card) => card.season_id === previousSeason?.id);

				const existingPlayer: PlayerSeasonCards = {
					player: player,
					currentCard: currentCard ? mapToFullPlayer(player, currentCard) : null,
					previousCard: previousCard ? mapToFullPlayer(player, previousCard) : null
				};
				playerSeasonCards.push(existingPlayer);
			} else {
				const newPlayer: PlayerSeasonCards = {
					player: player,
					currentCard: null,
					previousCard: null
				};
				playerSeasonCards.push(newPlayer);
			}
		});

		return playerSeasonCards;
	};

	let container: any;
	afterUpdate(() => {
		container = document.getElementById('scrollContainer');
		if (container) {
			container.scrollLeft = container.scrollWidth; // scroll to the end
		}
	});
</script>

{#if allPlayers}
	<div class="w-full flex flex-col gap-4">
		<div class="flex flex-row gap-2 justify-center flex-wrap">
			{#each currentSeasonCards as currentCard (currentCard.player_id)}
				<Card player={currentCard} card_size={CARD_SIZE.MEDIUM} />
			{/each}
		</div>

		{#if seasonIsActive && currentSeasonCards.length > 0 && previousSeasonCards.length > 0}
			<div class="border-b w-full flex justify-end">
				<button class="flex flex-row gap-2 text-lg items-center justify-end p-2" on:click={() => (openSeasons = !openSeasons)}>
					{openSeasons ? 'Skjul' : 'Vis'} fjorårets spillere
					{#if openSeasons}
						<ArrowUpIcon />
					{:else}
						<ArrowDownIcon />
					{/if}
				</button>
			</div>
		{/if}

		{#if seasonIsActive && openSeasons}
			<div class="flex flex-row gap-2 justify-center flex-wrap">
				{#each previousSeasonCards as previousCard}
					<Card player={previousCard} card_size={CARD_SIZE.SMALL} />
				{/each}
			</div>
		{/if}
	</div>

	{#if seasonIsActive}
		<div class="structure">
			<div class={`w-full grid grid-cols-2`}>
				<div class="flex flex-col gap-2 items-center">
					<h3>Forrige sesong</h3>
					<h4>{previousSeason?.name}</h4>
				</div>

				<div class="flex flex-col gap-2 items-center">
					<h3>Nåværende sesong</h3>
					<h4>{season?.name}</h4>
				</div>
			</div>

			<div class="w-full flex flex-col gap-4">
				{#each allPlayerSeasonCards as playerSeasonCards}
					<div class="flex flex-col gap-2 border py-4">
						<h3 class="text-center">{playerSeasonCards.player.name}</h3>
						<div class={`grid grid-cols-2`}>
							<div class="flex flex-col items-center">
								<Card player={playerSeasonCards.previousCard} card_size={CARD_SIZE.MEDIUM} />
							</div>

							<div class="flex flex-col items-center">
								<CreateCard
									player={playerSeasonCards.player}
									seasonId={season?.id ?? 0}
									card_size={CARD_SIZE.MEDIUM}
									currentCard={playerSeasonCards.currentCard}
									previousCard={playerSeasonCards.previousCard}
								/>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
{/if}
