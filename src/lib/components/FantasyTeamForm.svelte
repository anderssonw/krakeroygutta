<script lang="ts">
	import type { FantasyTeam } from '$lib/types/FantasyTeam';
	import type { Player } from '$lib/types/Player';
	import type { ActionData } from '../../routes/fantasy/$types';

	export let form: ActionData;
	export let players: Player[];
	export let budget: number;

	$: restBudget = () => {
		let total = 0;
		team.playerIds
			.filter((player) => player)
			.forEach((player) => {
				total += findPlayer(player)?.price || 0;
			});
		return budget - total;
	};

	let team: FantasyTeam = {
		name: form?.data.name || '',
		playerIds: form?.data.playerIds || [],
		captainId: form?.data.captainId || -1
	};

	$: notChosenPlayers = (extraPlayerNum: number) => {
		let newPlayers = players.filter((player) => {
			{
				let playerIfExists = team.playerIds.find(
					(chosenPlayer) => findPlayer(chosenPlayer)?.playerName == player.playerName
				);

				if (playerIfExists) return false;

				return true;
			}
		});

		const extraPlayer = findPlayer(extraPlayerNum);

		if (extraPlayer) newPlayers.push(extraPlayer);

		return newPlayers;
	};

	const findPlayer = (id: number) => {
		return players.find((player) => player.id == id);
	};
</script>

<form class="form" method="POST" action="?/register">
	<label for="name">Lagnavn</label>
	<input type="text" name="name" bind:value={team.name} />
	{#if form?.missingName}<p class="error">Du må velge et lagnavn</p>{/if}
	{#each [...Array(4).keys()] as index}
		<label for={'player-' + index}>Spillervalg {index + 1}</label>
		<select name={'player-' + index} id={'player-' + index} bind:value={team.playerIds[index]}>
			<option value selected default disabled>Velg Spiller</option>
			{#each notChosenPlayers(team.playerIds[index]) as player}
				<option value={player.id}>{player.playerName}</option>
			{/each}
		</select>
	{/each}
	{#if form?.missingPlayers}<p class="error">Du må velge alle spillere</p>{/if}
	<label for="captain">Lagkaptein</label>
	<select name="captain" bind:value={team.captainId}>
		<option value selected default disabled>Velg Spiller</option>
		{#each team.playerIds.map((player) => findPlayer(player)) as player}
			{#if player}
				<option value={player.id}>{player.playerName}</option>
			{/if}
		{/each}
	</select>
	{#if form?.missingCaptain}<p class="error">Du må velge en lagkaptein</p>{/if}
	<p>Gjenværende budsjett: {restBudget()}</p>
	{#if restBudget() <= 0}
		<button type="submit" disabled>Send Inn</button>
	{:else}
		<button type="submit">Send Inn</button>
	{/if}
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
	}

	.error {
		color: red;
	}
</style>
