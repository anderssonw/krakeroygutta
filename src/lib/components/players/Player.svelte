<script lang="ts">
	import type { FullPlayer } from '$lib/types/newTypes';
	import { onMount } from 'svelte';
	export let player: FullPlayer | null;

	let card_type: string = 'bronze';
	onMount(() => {
		if (player) {
			if (player.price > 4000 && player.price < 5000) {
				card_type = 'silver';
			}
			if (player.price >= 5000) {
				card_type = 'gold';
			}
		}
	});
</script>

<div class="structure">
	<div class="relative w-full h-96 bg-primary-color">
		<img src="/cards/{card_type}back.png" alt="bronze" class="w-full h-full object-cover" />
		<div class="w-60 absolute bottom-0 left-1/2 -translate-x-1/2">
			<img src="/profile/placeholder.png" alt="head" />
		</div>
	</div>

	<div class="w-full flex flex-col items-center space-y-4 pb-12 border-b-4 border-secondary-light">
		<h1>{player?.name}</h1>
		<h2>Pris: {player?.price}</h2>
	</div>

	<div class="w-full flex flex-col items-center space-y-4 pb-12 border-b-4 border-secondary-light">
		<h2>Stats</h2>
		<div class="w-full flex flex-row">
			<h3 class="grow">Attack</h3>
			<h3 class="grow text-end">{player?.attack}</h3>
		</div>
		<div class="w-full flex flex-row">
			<h3 class="grow">Defence</h3>
			<h3 class="grow text-end">{player?.defence}</h3>
		</div>
		<div class="w-full flex flex-row">
			<h3 class="grow">Physical</h3>
			<h3 class="grow text-end">{player?.physical}</h3>
		</div>
		<div class="w-full flex flex-row">
			<h3 class="grow">Morale</h3>
			<h3 class="grow text-end">{player?.morale}</h3>
		</div>
		<h3>Overall: 50</h3>
	</div>

	<div class="w-full flex flex-col items-center space-y-4 pb-12 border-b-4 border-secondary-light">
		<h2>Summer 2023</h2>
		<div class="w-full flex flex-row">
			<h3 class="grow">Wins</h3>
			<h3 class="grow text-end">0</h3>
		</div>
	</div>
</div>
