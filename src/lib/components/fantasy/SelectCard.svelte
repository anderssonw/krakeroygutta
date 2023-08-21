<script lang="ts">
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import CardInfo from '../fantasy/CardSmallInfo.svelte';
	export let player: FullPlayer;
	export let fantasyForm: FantasyForm;

	function buyPlayer(player: FullPlayer) {
		fantasyForm.players[fantasyForm.selectedCardPosition] = player;
		fantasyForm.selectedCardPosition = -1;
	}
</script>

<div class="w-1/4 flex-grow">
	<div class="flex flex-row gap-2">
		<div class="small-card" on:mouseup={() => buyPlayer(player)}>
			<CardInfo {player} />
		</div>
		<div>
			<h5>Price: {player.price}</h5>
			<h5>Team</h5>
			<!-- <h5>Goals </h5>
			<h5>Assist</h5>
			<h5>Wins</h5>
			<h5>Clean sheets</h5> -->
		</div>
	</div>
</div>
