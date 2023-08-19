<script lang="ts">
	import type { Tables } from '$lib/types/database.helper.types';
	import CardLarge from './CardLarge.svelte';

	export let players: Tables<'players'>[];
</script>

<div class="structure">
	<h2>Spillere</h2>
	<div class="w-full flex flex-row flex-wrap gap-4 justify-center">
		{#each players as player}
			<CardLarge {player} />
		{/each}
	</div>
</div>
