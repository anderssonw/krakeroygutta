<script lang="ts">
	import jogaVideo from '$lib/assets/jogabonito.mp4';
	import type { PageData } from './$types';
	import SeasonButton from '$lib/components/index/SeasonButton.svelte';
	import type { FantasyTeamFull, FantasyTeamWithPlayers } from '$lib/types/newTypes';
	import { getPointsFromTeamStats, getTeamStatsFromMatches, mapTeamStats, getTotalPointsForPlayers } from '$lib/shared/MatchStatsFunctions';

	export let data: PageData;
	$: ({ season, teams, allMatches, teamStats, lazy } = data);
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);

	// Not a huge fan of the typing, perhaps we should do something nicer here, idk
	const getFantasyTeamsWithPoints = (fantasyTeams: FantasyTeamWithPlayers[]): FantasyTeamFull[] => {
		if (matches.length === 0) {
			return fantasyTeams.map((fantasyTeam) => {
				return { ...fantasyTeam, points: 0 };
			});
		}

		let playersWithPoints = getTotalPointsForPlayers(matches);

		return fantasyTeams
			.map((fantasyTeam) => {
				let pointsForFantasyTeam = 0;

				fantasyTeam.fantasy_teams_players.forEach((player) => {
					let isCaptainFactor = fantasyTeam.captain_id === player.player_id ? 2 : 1;

					if (playersWithPoints[player.player_id]) {
						pointsForFantasyTeam += isCaptainFactor * playersWithPoints[player.player_id];
					}
				});

				return {
					...fantasyTeam,
					points: pointsForFantasyTeam
				};
			})
			.sort((a, b) => b.points - a.points);
	};
</script>

<div class="structure mb-16 tablet:mb-24 laptop:mb-32">
	<div class="w-full h-[44vw] laptop:h-128 border-b-4">
		<video class="relative scale-y-50 origin-top-left" width="100%" autoplay muted loop>
			<source src={jogaVideo} type="video/mp4" />
		</video>
	</div>
	{#if season && teams}
		<h1>{season.name}</h1>
		<div class="w-full px-6 laptop:px-0">
			<table class="table-fixed w-full bg-secondary-color-light text-primary-color-dark rounded-lg text-xs laptop:text-sm">
				<thead>
					<tr class="border-b-2 border-secondary-color-dark">
						<th class="border-r-2 border-secondary-color-dark w-2/12">Pos.</th>
						<th class="border-r-2 border-secondary-color-dark w-5/12">Lag</th>
						<th class="border-r-2 border-secondary-color-dark w-2/12">Poeng</th>
						<th class="w-1/12">S</th>
						<th class="w-1/12">U</th>
						<th class="w-1/12">T</th>
					</tr>
				</thead>
				<tbody>
					{#each getTeamStatsFromMatches(teams, matches).sort((a, b) => getPointsFromTeamStats(b) - getPointsFromTeamStats(a)) as team, i}
						<tr class="border-t-2 border-secondary-color">
							<th class="border-r-2 border-secondary-color">{i + 1 + '.'}</th>
							<th class="border-r-2 border-secondary-color flex-row items-center justify-center">
								{team.name}
								<div class="inline-block w-3 h-3 div-team-{team.color} drop-shadow-[0_0_1px_rgba(0,0,0,0.7)]" />
							</th>
							<th class="border-r-2 border-secondary-color">{getPointsFromTeamStats(team)}</th>
							<th>{team.wins}</th>
							<th>{team.draws}</th>
							<th>{team.losses}</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="w-full px-6 laptop:px-0 grid grid-cols-2 laptop:grid-cols-4 gap-4">
			<SeasonButton image="players" text="Spillere" />
			<SeasonButton image="teams" text="Lag" />
			<SeasonButton image="matches" text="Kamper" />
			<SeasonButton image="bets" text="Veddemål" />
		</div>
	{:else}
		<p>No season active</p>
	{/if}
</div>

{#if season}
	<div class="flex flex-col items-center bg-slate-100 text-green-900 pt-4 pb-12">
		<h1 class="mt-12 text-4xl font-bold">Fantasypoeng</h1>

		{#await lazy?.fantasyTeams then fantasyTeams}
			<table class="text-left w-3/4 tablet:w-2/3">
				<tr class="border-b border-dashed border-b-green-900 font-light pb-4">
					<td class="px-2">Posisjon</td>
					<td class="px-2">Lag</td>
					<td class="px-2">Poeng</td>
				</tr>

				<tr class="h-4" />

				{#each getFantasyTeamsWithPoints(fantasyTeams ?? []) as team, i}
					<tr class=" even:bg-green-100 odd:bg-green-50">
						<td class="px-2">{i + 1 + '.'} plass</td>
						<td class="px-2">{team.name}</td>
						<td class="px-2">{team.points} poeng</td>
					</tr>
				{/each}
			</table>
		{:catch error}
			<p>Noe gikk galt under henting av Fantasy-lag</p>
			<p>{error}</p>
		{/await}
	</div>
{/if}
