<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import AdminTeamSelect from '$lib/components/admin/AdminTeamSelect.svelte';
	import MagnifierIcon from 'virtual:icons/ph/magnifying-glass-bold';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import type { PageData, ActionData } from './$types';
	import { goto } from '$app/navigation';

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
		class="w-2/3 tablet:w-auto flex flex-col mt-0 pt-0"
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
	<div class="w-full px-4">
		{#await matches}
			<p>Henter Kamper</p>
		{:then matches}
			{#if matches.length === 0}
				<p>Ingen Kamper for denne sesongen</p>
			{:else}
			<div class="flex flex-row justify-between">
				<div class="grid grid-cols-7 w-[85%] py-2 border-b">
					<div class="col-span-1">
						<h5 class="font-semibold">ID</h5>
					</div>
					<div class="col-span-3">
						<h5 class="font-semibold">Hjemmelag</h5>
					</div>
					<div class="col-span-3">
						<h5 class="font-semibold">Bortelag</h5>
					</div>
				</div>
				<div>
				</div>
			</div>
				{#each matches.sort((a, b) => {
					return a.id - b.id;
				}) as match}
					<div class="flex flex-row justify-between">
						<div class="grid grid-cols-7 w-[85%] py-4 border-b cursor-pointer" on:click={() => goto(`${$page.url.pathname}/${match.id}`)}>
							<div class="col-span-1">
								<p>{match.id}</p>
							</div>
							<div class="col-span-3">
								<p>{match.team_home?.name}</p>
							</div>
							<div class="col-span-3">
								<p>{match.team_away?.name}</p>
							</div>
						</div>
						<form class="flex justify-between items-center" method="POST" action="?/delete-match" use:enhance>
							<input hidden name="id" value={match.id} />
							<button class="py-0 px-2">
								<DeleteIcon class="cursor-pointer" />
							</button>
						</form>
					</div>
				{/each}
			{/if}
		{:catch error}
			<p>Noe gikk galt!</p>
		{/await}
	</div>
</div>