<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import AdminTeamSelect from '$lib/components/admin/AdminTeamSelect.svelte';
	import MatchStatRow from '$lib/components/matches/MatchStatRow.svelte';
	import type { PageData, ActionData } from './$types';

	export let form: ActionData;
	export let data: PageData;
	$: matches = data.lazy?.matches;

	let teams = [
		{
			id: 1,
			name: 'Grønne Galinger'
		},
		{
			id: 2,
			name: 'Blåe Bavianer'
		},
		{
			id: 3,
			name: 'Røde Runkere'
		}
	];

	interface MatchForm {
		teamHomeId: number | undefined;
		teamAwayId: number | undefined;
	}

	$: matchForm = {} as MatchForm;

	$: seasonId = Number($page.url.searchParams.get('season'));

	const getAvailableTeams = (teams: { id: number; name: string }[], selectedTeamId: number | undefined) => {
		return teams.filter((team) => {
			if (team.id === selectedTeamId) return true;

			return team.id != matchForm.teamHomeId && team.id != matchForm.teamAwayId;
		});
	};
</script>

<div class="structure">
	<table>
		<tr>
			<th>ID</th>
			<th>Hjemmelag</th>
			<th>Score</th>
			<th>Bortelag</th>
			<th />
		</tr>
		{#await matches}
			<p>Henter Kamper</p>
		{:then matches}
			{#if matches.length === 0}
				<p>Ingen Kamper for denne sesongen</p>
			{:else}
				{#each matches as match}
					<tr>
						<td>
							{match.id}
						</td>
						<td>
							{match.team_home_id}
						</td>
						<td>
							{`2-0`}
						</td>
						<td>
							{match.team_away_id}
						</td>
						<td>
							<a href={`${$page.url.pathname}/${match.id}`}>Go</a>
						</td>
					</tr>
				{/each}
			{/if}
		{:catch error}
			<p>Noe gikk galt!</p>
		{/await}
	</table>

	<h4>Ny Kamp</h4>
	<form
		class="flex flex-col"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				matchForm = {
					teamAwayId: undefined,
					teamHomeId: undefined
				};

				seasonId = Number($page.url.searchParams.get('season'));
			};
		}}
	>
		<AdminTeamSelect
			id="teamHomeId"
			label="Velg Hjemmelag"
			teams={getAvailableTeams(teams, matchForm.teamHomeId)}
			bind:value={matchForm.teamHomeId}
		/>
		{#if form?.create?.errors['teamHomeId']}
			<p class="text-red-400">{form.create.errors['teamHomeId']}</p>
		{/if}
		<AdminTeamSelect
			id="teamAwayId"
			label="Velg Bortelag"
			teams={getAvailableTeams(teams, matchForm.teamAwayId)}
			bind:value={matchForm.teamAwayId}
		/>
		{#if form?.create?.errors['teamAwayId']}
			<p class="text-red-400">{form.create.errors['teamAwayId']}</p>
		{/if}
		<input hidden name="seasonId" value={seasonId} />

		<button class="btn bg-green-400">Opprett Kamp</button>
	</form>
</div>
