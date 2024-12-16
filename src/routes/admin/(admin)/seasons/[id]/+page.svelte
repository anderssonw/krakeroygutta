<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import AdminSeasonInput from '$lib/components/admin/AdminSeasonInput.svelte';

	export let data;

	$: ({ season, players } = data);
</script>

<div class="structure">
	{#if players}
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
				return b.stats.price - a.stats.price;
			}) as player}
				<tr>
					<td>{player.name}</td>
					<td>{Object.keys(player.stats).length !== 0 ? 'Ja' : 'Nei'}</td>
					<td>{player.stats.attack}</td>
					<td>{player.stats.defence}</td>
					<td>{player.stats.morale}</td>
					<td>{player.stats.physical}</td>
					<td>{player.stats.skill}</td>
					<td>{player.stats.price}</td>
				</tr>
			{/each}
		</table>
	{/if}
	{#if season}
		Administrer sesong
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
			/>
		</form>
	{/if}
</div>
