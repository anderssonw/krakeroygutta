<script lang="ts">
	import { goto } from '$app/navigation';
	import type { FantasyForm } from '$lib/types/newTypes';
	import CardSmallInfo from './CardSmallInfo.svelte';

	export let playerId: number;
	export let fantasyForm: FantasyForm;
	export let position: number;

	let card_type: string = 'bronze';

	function handleCardClick() {
		fantasyForm.selectedCard = position;
	}

	function handleCaptainClick(pid: number) {
		fantasyForm.captain = pid;
	}

	function sellPlayer(player: number) {
		fantasyForm.team[position] = 0;
		//fantasyForm.cash += player.price;
	}
</script>

{#if !playerId}
	<div class="small-card" on:mouseup={() => handleCardClick()}>
		<img src="/cards/empty.png" alt="card" />
	</div>
{:else}
	<div class="small-card group">
		<CardSmallInfo player={playerId} />

		<div class="w-40 absolute left-[100%] hidden group-hover:block group-hover:animate-fadeIn z-100">
			<button class="btn w-full mb-1" on:click={() => sellPlayer(playerId)}>Selg spiller</button>
			<button class="btn w-full mb-1" on:click={() => handleCaptainClick(playerId || 0)}>Velg kaptein</button>
			<a href="/players/{playerId}" target="_blank" rel="noreferrer" class="p-0">
				<button class="btn w-full mb-1">Statistikk</button>
			</a>
		</div>
	</div>
{/if}
