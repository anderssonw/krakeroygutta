<script lang="ts">
	import FantasyTeamForm from '$lib/components/FantasyTeamForm.svelte';
	import FantasyTeamView from '$lib/components/FantasyTeamView.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import { page } from '$app/stores';

	import type { Player } from '$lib/types/Player';
	import type { ActionData } from './$types';
	import type { FantasyTeam } from '$lib/types/FantasyTeam';

	/** @type {import('./$types').PageData[]} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form: ActionData;

	let players: Player[] = data.players;
	let team: FantasyTeam = data.team;

	const budget = 17500;
</script>

<main class="content">
	{#if players}
		<h3>Velkommen til Fantasy!</h3>
		<p>
			Hei! Og velkommen til denne testen av Fantasy Julebord. På denne siden kan du sette opp fire
			spillere til ditt Fantasy Julebord-lag. Poenggivning til spillerne vil i stor grad følge
			reglene som brukes hos vår hovedkonkurrent, Fantasy Premier League. Deadline: kl 12 lørdag
			17.12. Vinneren vil kåres senere på samme dag. Lykke til og god jul!
		</p>
		<div class="container">
			{#each players.sort((a, b) => b.price - a.price) as player}
				<PlayerCard price={player.price} name={player.playerName} />
			{/each}
		</div>

		{#if $page.data.session}
			{#if form?.success}
				<p>Gratulerer, du har sendt inn laget ditt!</p>
			{:else if team}
				<FantasyTeamView {players} {team} />
			{:else}
				<FantasyTeamForm {players} {form} {budget} />
			{/if}
		{:else}
			<p>Du må logge inn for å sende inn et lag.</p>
		{/if}
	{:else}
		<p>Laster..</p>
	{/if}
</main>

<style>
	.content {
		text-align: center;
	}

	.container {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-gap: 1rem;
		justify-content: center;
		justify-items: center;
		row-gap: 1em;
	}

	@media (max-width: 768px) {
		.container {
			grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
			display: grid;
			grid-gap: 1rem;
			justify-content: center;
			justify-items: center;
		}
	}
</style>
