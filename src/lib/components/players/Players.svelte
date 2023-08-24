<script lang="ts">
	import type { FullPlayer } from '$lib/types/newTypes';
	import CardLarge from './CardLarge.svelte';

	export let players: FullPlayer[];
</script>

<div class="structure">
	<h2>Spillere</h2>
	<div class="w-full flex flex-row flex-wrap gap-4 justify-center">
		{#each players as player}
			<CardLarge {player} />
		{/each}
	</div>
</div>
