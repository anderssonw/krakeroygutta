<script lang="ts">
	import { goto } from '$app/navigation';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer } from '$lib/types/newTypes';
	import Card from '../cards/Card.svelte';

	export let players: FullPlayer[];
	export let season: Tables<'seasons'> | null;
</script>

<div class="structure">
	<div class="w-full flex flex-row flex-wrap gap-4 justify-center">
		{#each players as player}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="clickable-card" on:mouseup={() => goto(`/players/${player.player_id}`)}>
				<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />
			</div>
		{/each}
	</div>
</div>
