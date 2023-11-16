<script lang="ts">
	import { isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FantasyForm, FullPlayer, MatchStatsQuery } from '$lib/types/newTypes';
	import Card from '../cards/Card.svelte';
	import FantasyCardButtons from './FantasyCardButtons.svelte';

	export let player: FullPlayer | null;
	export let fantasyForm: FantasyForm;
	export let position: number;
	export let season: Tables<'seasons'> | null;
	export let playersWithPoints: number[];

	$: isCaptain = player?.player_id == fantasyForm.captainId;
	
	const calculatePlayerPoints = (): number => {
		if (player) {
			let myPlayerPoints = playersWithPoints[player.player_id];
			let isCaptainFactor = isCaptain ? 2 : 1;
			return myPlayerPoints * isCaptainFactor;
		}

		return 0
	};
</script>

{#if player}
	<div class="clickable-card active:scale-105 player-{position} relative">
		{#if season && isSeasonPastDeadline(season)}
			<div class="mb-2 flex flex-col gap-1">
				<h5 class="text-center">Poeng</h5>
				<h3 class="text-center text-secondary-color-light">
					<span class="border-4 rounded-lg px-6 text-2xl font-bold">{calculatePlayerPoints()}</span>
				</h3>
			</div>
		{/if}

		<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />

		<div class="absolute left-full top-16 flex flex-col space-y-1">
			{#if season}
				<FantasyCardButtons bind:fantasyForm={fantasyForm} player={player} position={position} isSeasonPastDeadline={isSeasonPastDeadline(season)} />
			{/if}
		</div>
	</div>
{:else if season && isSeasonPastDeadline(season)}
	<button type="button" class="cursor-not-allowed player-{position}">
		<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />
	</button>
{:else}
	<button type="button" class="clickable-card player-{position}" on:mouseup={() => (fantasyForm.selectedCardPosition = position)}>
		<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />
	</button>
{/if}
