<script lang="ts">
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import CardSmallInfo from './CardSmallInfo.svelte';

	export let player: FullPlayer;
	export let fantasyForm: FantasyForm;
	export let position: number;

	function handleCaptainClick(playerId: number) {
		fantasyForm.captainId = playerId;
	}

	function sellPlayer() {
		fantasyForm.players[position] = null;
		if (fantasyForm.captainId == player.id) {
			fantasyForm.captainId = -1;
		}
	}

	$: isCaptain = fantasyForm.captainId == player.id;
</script>

<div class="small-card group">
	<CardSmallInfo {isCaptain} {player} />

	<div class="w-40 absolute left-[100%] hidden group-hover:block group-hover:animate-fadeIn z-100">
		<button type="button" class="btn w-full mb-1" on:click={() => sellPlayer()}>Selg spiller</button>
		<button type="button" class="btn w-full mb-1" on:click={() => handleCaptainClick(player.id)}>Velg kaptein</button>
		<a href="/players/{player.id}" target="_blank" rel="noreferrer" class="p-0">
			<button type="button" class="btn w-full mb-1">Statistikk</button>
		</a>
	</div>
</div>
