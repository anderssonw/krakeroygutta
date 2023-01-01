<script lang="ts">
	import FantasyTeamForm from '$lib/components/FantasyTeamForm.svelte';

	import type { Player } from '$lib/types/Player';
	import type { ActionData } from './$types';

	/** @type {import('./$types').PageData["players"]} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form: ActionData;

	let players: Player[] = data.players;

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
		<table class="playerTable">
			<thead>
				<th>Spiller</th>
				<th>Pris</th>
				{#each players.sort((a, b) => b.price - a.price) as player}
					<tr>
						<td> {player.playerName} </td>
						<td> {player.price} </td>
					</tr>
				{/each}
			</thead>
		</table>

		<p>Totalbudsjett: {budget}</p>

		{#if form?.success}
			<p>Gratulerer, du har sendt inn laget ditt!</p>
		{:else}
			<FantasyTeamForm {players} {form} {budget} />
		{/if}
	{/if}
</main>

<style>
	.content {
		padding: 0 16vh 0 16vh;
		text-align: center;
	}

	.playerTable {
		display: flex;
		justify-content: center;
	}
</style>
