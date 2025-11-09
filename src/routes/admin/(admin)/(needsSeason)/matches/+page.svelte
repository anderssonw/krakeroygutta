<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import AdminTeamSelect from '$lib/components/admin/AdminTeamSelect.svelte';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import MagnifierIcon from 'virtual:icons/ph/magnifying-glass-bold';
	import type { PageData, ActionData } from './$types';
	import { goto } from '$app/navigation';
	import type { Tables } from '$lib/types/database.generated.types';

	export let form: ActionData;
	export let data: PageData;

	$: ({ matches, teams, players, goals } = data);

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

	const getGoalCountForTeam = (matchId: number, teamId: number, goals: Tables<'goals'>[]) => {
		return goals.filter((goal) => {
			const isCorrectMatch = goal.match_id == matchId;
			if (!isCorrectMatch) return false;

			const playerForGoal = players?.find((player) => player.id === goal.goal_player_id && player.team_id === teamId);
			if (!playerForGoal) return false;

			return true;
		}).length;
	};
</script>

<div class="flex flex-col gap-4 items-center">
	<h4>Ny Kamp</h4>
	<form
		class="flex flex-col mt-0 pt-0"
		method="POST"
		action="?/create-match"
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
			<div class="flex gap-2 flex-grow justify-between">
				<div class="flex flex-col">
					<AdminTeamSelect
						id="teamHomeId"
						label="Velg Hjemmelag"
						teams={getAvailableTeams(teams, matchForm.teamHomeId)}
						bind:value={matchForm.teamHomeId}
					/>
					{#if form?.create?.errors['teamHomeId']}
						<p class="text-red-400">{form.create.errors['teamHomeId']}</p>
					{/if}
				</div>
				<div class="flex flex-col">
					<AdminTeamSelect
						id="teamAwayId"
						label="Velg Bortelag"
						teams={getAvailableTeams(teams, matchForm.teamAwayId)}
						bind:value={matchForm.teamAwayId}
					/>
					{#if form?.create?.errors['teamAwayId']}
						<p class="text-red-400">{form.create.errors['teamAwayId']}</p>
					{/if}
				</div>
				<input hidden name="seasonId" value={seasonId} />
			</div>

			<button class="btn bg-green-400 mt-4">Opprett Kamp</button>
		{:catch error}
			<p>Noe gikk galt</p>
		{/await}
	</form>
	<div class="px-4">
		{#await matches}
			<p>Henter Kamper</p>
		{:then matches}
			{#if matches.length === 0}
				<p>Ingen Kamper for denne sesongen</p>
			{:else}
				<table>
					<tr class="text-center">
						<th>Hjemmelag</th>
						<th>Score</th>
						<th>Bortelag</th>
						<th />
					</tr>

					{#each matches.sort((a, b) => {
						return b.id - a.id;
					}) as match}
						<tr>
							<td>
								<p>{match.team_home?.name}</p>
							</td>
							<td class="text-center">
								{getGoalCountForTeam(match.id, match.team_home_id, goals)} - {getGoalCountForTeam(match.id, match.team_away_id, goals)}
							</td>
							<td>
								<p>{match.team_away?.name}</p>
							</td>
							<td>
								<div class="flex gap-2">
									<button on:click={() => goto(`${$page.url.pathname}/${match.id}`)}>
										<MagnifierIcon style="font-size: 1.2em" class="cursor-pointer" />
									</button>

									<form method="POST" action="?/delete-match" use:enhance>
										<button>
											<input hidden name="id" value={match.id} />
											<DeleteIcon style="font-size: 1.2em" class="cursor-pointer" />
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</table>
			{/if}
		{:catch error}
			<p>Noe gikk galt!</p>
		{/await}
	</div>
</div>
