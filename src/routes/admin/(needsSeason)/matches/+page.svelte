<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import AdminTeamSelect from '$lib/components/admin/AdminTeamSelect.svelte';
	import MagnifierIcon from 'virtual:icons/ph/magnifying-glass-bold';
	import type { PageData, ActionData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: matches = data.lazy.matches;
	$: teams = data.lazy.teams;

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
	<h4>Ny Kamp</h4>
	<form
		class="flex flex-col mt-0 pt-0"
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
		{#await teams}
			<p>Laster</p>
		{:then teams}
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

			<button class="btn bg-green-400 mt-4">Opprett Kamp</button>
		{:catch error}
			<p>Noe gikk galt</p>
		{/await}
	</form>
	<table>
		{#await matches}
			<p>Henter Kamper</p>
		{:then matches}
			{#if matches.length === 0}
				<p>Ingen Kamper for denne sesongen</p>
			{:else}
				<tr class="text-left">
					<th class="px-4">ID</th>
					<th class="px-4">Hjemmelag</th>
					<th class="px-4">Bortelag</th>
					<th class="px-4" />
				</tr>
				{#each matches.sort((a, b) => {
					return a.id - b.id;
				}) as match}
					<tr>
						<td class="px-4">
							{match.id}
						</td>
						<td class="px-4">
							{match.team_home?.name}
						</td>
						<td class="px-4">
							{match.team_away?.name}
						</td>
						<td class="px-4">
							<a href={`${$page.url.pathname}/${match.id}`}>
								<MagnifierIcon class="cursor-pointer" />
							</a>
						</td>
					</tr>
				{/each}
			{/if}
		{:catch error}
			<p>Noe gikk galt!</p>
		{/await}
	</table>
</div>
