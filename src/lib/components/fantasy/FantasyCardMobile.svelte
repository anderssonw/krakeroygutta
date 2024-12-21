<script lang="ts">
	import { isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import Card from '../cards/Card.svelte';
	import FantasyCardButtons from './FantasyCardButtons.svelte';

	export let player: FullPlayer | null;
	export let fantasyForm: FantasyForm;
	export let position: number;
	export let season: Tables<'seasons'> | null;
	export let points: number;
</script>

{#if player}
	<div class="flex flex-col items-center">
		{#if season && isSeasonPastDeadline(season)}
			<div class="mb-2 flex flex-col gap-1">
				<p class="text-center">Poeng</p>
				<h3 class="text-center text-secondary-color-light">
					<span class="border-4 rounded-lg px-6 text-2xl font-semibold">{points}</span>
				</h3>
			</div>
		{/if}

		<div>
			<Card {player} card_size={CARD_SIZE.SMALL} />
		</div>

		<div class="flex flex-row space-x-2">
			{#if season}
				<FantasyCardButtons bind:fantasyForm player={player} position={position} isSeasonPastDeadline={isSeasonPastDeadline(season)} />
			{/if}
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center">
		<button type="button" class="clickable-card" on:mouseup={() => (fantasyForm.selectedCardPosition = position)}>
			<Card {player} card_size={CARD_SIZE.SMALL} />
		</button>
	</div>
{/if}
