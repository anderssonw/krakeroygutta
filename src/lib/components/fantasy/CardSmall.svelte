<script lang="ts">
	import { goto } from '$app/navigation';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import CardSmallInfo from './CardSmallInfo.svelte';

	export let player: FullPlayer;
	export let fantasyForm: FantasyForm;
	export let position: number;

	let card_type: string = 'bronze';

	function handleCardClick() {
		fantasyForm.selectedCardPosition = position;
	}

	function handleCaptainClick(pid: number) {
		fantasyForm.captainId = pid;
	}

	function sellPlayer(player: number) {
		fantasyForm.players[position] = null;
		//fantasyForm.cash += player.price;
	}
</script>

<div class="small-card group">
	<CardSmallInfo {player} />

	<div class="w-40 absolute left-[100%] hidden group-hover:block group-hover:animate-fadeIn z-100">
		<button class="btn w-full mb-1" on:click={() => sellPlayer(player.id)}>Selg spiller</button>
		<button class="btn w-full mb-1" on:click={() => handleCaptainClick(player.id || 0)}>Velg kaptein</button>
		<a href="/players/{player.id}" target="_blank" rel="noreferrer" class="p-0">
			<button class="btn w-full mb-1">Statistikk</button>
		</a>
	</div>
</div>
