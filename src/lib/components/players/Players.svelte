<script lang="ts">
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';
	import Card from '../cards/Card.svelte';

	export let players: FullPlayer[];
</script>

<div class="structure">
	<div class="w-full flex flex-row flex-wrap gap-4 justify-center">
		{#each players as player}
			<Card player={player} card_size={CARD_SIZE.MEDIUM} />
		{/each}
	</div>
</div>
