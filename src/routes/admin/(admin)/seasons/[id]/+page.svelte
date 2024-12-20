<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import AdminSeasonInput from '$lib/components/admin/AdminSeasonInput.svelte';

	export let data;

	import { page } from '$app/stores';
	import type { PlayerWithStats } from './types.js';
	import type { Tables } from '$lib/types/database.helper.types.js';

	const playersToPlayersSeason = (players: PlayerWithStats[]): Tables<'players_seasons'>[] => {
		return players
			.map((player): Tables<'players_seasons'> | null => {
				if (!player.isInSeason) return null;

				return {
					player_id: player.id,
					season_id: parseInt($page.params.id),
					attack: player.stats.attack,
					defence: player.stats.defence,
					morale: player.stats.morale,
					physical: player.stats.physical,
					skill: player.stats.skill,
					price: player.stats.price
				};
			})
			.filter((player) => player != null);
	};

	const updatePlayers = async (players: Tables<'players_seasons'>[]) => {
		const response = await fetch(`/admin/seasons/${$page.params.id}`, {
			method: 'POST',
			body: JSON.stringify(players),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status === 200) {
			invalidateAll();
		}
	};

	$: ({ season, players } = data);
</script>

<div class="structure">
	{#if players}
		<h2>Administrer Spillere</h2>
		<table class="w-full">
			<tr class="text-left">
				<th>Navn</th>
				<th>Er med på sesong?</th>
				<th>Angrep</th>
				<th>Forsvar</th>
				<th>Moral</th>
				<th>Fysikk</th>
				<th>Skill</th>
				<th>Pris</th>
			</tr>
			{#each players.sort((a, b) => {
				return a.name.localeCompare(b.name);
			}) as player}
				<tr>
					<td>{player.name}</td>
					<td>
						<select class="w-16 bg-primary-color" name="isInSeason" id="isInSeason" bind:value={player.isInSeason}>
							<option value={true}>Ja</option>
							<option value={false}>Nei</option>
						</select>
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.attack} />
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.defence} />
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.morale} />
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.physical} />
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.skill} />
					</td>
					<td>
						<input class="w-16" disabled={!player.isInSeason} type="number" bind:value={player.stats.price} />
					</td>
				</tr>
			{/each}
		</table>
		<button class="btn bg-green-500" on:click={() => updatePlayers(playersToPlayersSeason(players))}>Oppdater spillere</button>
	{/if}
	{#if season}
		<h2>Administrer Sesong</h2>
		<form
			class="form"
			method="POST"
			action="?/update"
			use:enhance={({}) => {
				return ({ result }) => {
					if (result.type === 'success') {
						invalidate('/');
					}
				};
			}}
		>
			<AdminSeasonInput
				id={season.id}
				name={season.name}
				startingCurrency={season.starting_currency}
				startTime={season.start_time}
				endTime={season.end_time}
				deadlineTime={season.deadline_time}
				pointsPerWin={season.points_per_win}
				pointsPerCleanSheet={season.points_per_clean_sheet}
				pointsPerGoal={season.points_per_goal}
				pointsPerAssist={season.points_per_assist}
				pointsPerClutch={season.points_per_clutch}
			/>
		</form>
	{/if}
</div>
