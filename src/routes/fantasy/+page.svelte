<script lang="ts">
	import { goto } from '$app/navigation';
	import Fantasy from '$lib/components/fantasy/Fantasy.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import SelectCardModal from '$lib/components/fantasy/SelectCardModal.svelte';
	import CardSmall from '$lib/components/fantasy/CardSmall.svelte';
	import type { FantasyForm } from '$lib/types/newTypes';

	// Get server data
	export let data: PageData;
	$: ({ session, fantasy, players, season } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});

	$: fantasyForm = {
		captain: fantasy?.captain_id || -1,
		cash: 0,
		selectedCard: 1,
		team: fantasy?.player_ids || [],
		team_name: fantasy?.name || 'placeholder'
	};

	$: currentPlayerCardId = -1;
	$: hasCardSelected = false;
	$: currentCash = calculateCurrentCash();

	const calculateCurrentCash = () => {};
</script>

{#if session}
	<SelectCardModal fantasyForm={null} {players} bind:hasCardSelected />

	<div class="structure">
		{#if season}
			<h2>Mitt fantasy lag</h2>
			<input class="input" type="text" placeholder="Team name" />
			<h3>Penger: 5000</h3>
			<button class="btn" on:click={() => console.log(fantasy)}> SAVE </button>

			<div class="relative flex flex-wrap w-full hidden tablet:block">
				<img src="/fantasy/Field.png" alt="field" />
				{#if fantasyForm}
					{#each fantasyForm.team as player, id}
						<div class="absolute player-{id}">
							<CardSmall {fantasyForm} playerId={player} position={id} />
						</div>
					{/each}
				{/if}
			</div>

			<div class="relative w-full bg-primary-color block tablet:hidden" />
		{:else}
			<h2>Currently no active season</h2>
		{/if}
	</div>
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
