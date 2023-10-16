<script lang="ts">
	// Get data from server if logged in
	import Content from '$lib/components/index/Content.svelte';
	import jogaVideo from '$lib/assets/jogabonito.mp4';
	import type { PageData } from './$types';
	import SeasonButton from '$lib/components/index/SeasonButton.svelte';
	import type { FantasyTeamFull, FantasyTeamWithPlayers, MatchStatsPlayer, MatchStatsQuery } from '$lib/types/newTypes';
	import { getPointsFromTeamStats, getTeamStatsFromMatches, mapTeamStats } from '$lib/shared/MatchStatsFunctions';

	export let data: PageData;
	$: ({ session, season, teams, allMatches, teamStats, lazy } = data);
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);

	// TODO Should check for clean sheet and victory and add those points too
	const addPointsFromMatchToPlayerMap = (playerMap: number[], players: MatchStatsPlayer[]) => {
		// TODO How many points should a goal be?
		const goalPointFactor = 2;

		players.forEach((player) => {
			if (!playerMap[player.id]) {
				playerMap[player.id] = 0;
			}

			playerMap[player.id] += player.goals * goalPointFactor + player.assists + player.clutches;
		});
	};

	const getTotalPointsForPlayers = (matches: MatchStatsQuery[]) => {
		let playerMap: number[] = [];

		matches.forEach((match) => {
			addPointsFromMatchToPlayerMap(playerMap, match.home_team.players);
			addPointsFromMatchToPlayerMap(playerMap, match.away_team.players);
		});

		return playerMap;
	};

	// Not a huge fan of the typing, perhaps we should do something nicer here, idk
	const getFantasyTeamsWithPoints = (fantasyTeams: FantasyTeamWithPlayers[]): FantasyTeamFull[] => {
		if (!matches) return [];

		let playersWithPoints = getTotalPointsForPlayers(matches);

		return fantasyTeams
			.map((fantasyTeam) => {
				let pointsForFantasyTeam = 0;

				fantasyTeam.fantasy_teams_players.forEach((player) => {
					let isCaptainFactor = fantasyTeam.captain_id === player.player_id ? 2 : 1;

					pointsForFantasyTeam += isCaptainFactor * playersWithPoints[player.player_id];
				});

				return {
					...fantasyTeam,
					points: pointsForFantasyTeam
				};
			})
			.sort((a, b) => b.points - a.points);
	};
</script>

{#if session}
	<div class="structure">
		<div class="w-full h-[44vw] laptop:h-128">
			<video class="relative scale-y-50 origin-top-left" width="100%" autoplay muted loop>
				<source src={jogaVideo} type="video/mp4" />
			</video>
		</div>
		{#if season && teams}
			<h1>{season.name}</h1>
			<table class="table-fixed w-full bg-secondary-color-light text-primary-color-dark laptop:rounded-lg">
				<thead>
					<tr class="border-b-2 border-secondary-color-dark">
						<th class="border-r-2 border-secondary-color-dark w-1/12 tablet:w-2/12">Pos.</th>
						<th class="border-r-2 border-secondary-color-dark w-5/12 tablet:w-4/12">Lag</th>
						<th class="border-r-2 border-secondary-color-dark w-3/12 tablet:w-3/12">Poeng</th>
						<th class="w-1/12 tablet:w-1/12">S</th>
						<th class="w-1/12 tablet:w-1/12">U</th>
						<th class="w-1/12 tablet:w-1/12">T</th>
					</tr>
				</thead>
				<tbody>
					{#each getTeamStatsFromMatches(teams, matches).sort((a, b) => getPointsFromTeamStats(b) - getPointsFromTeamStats(a)) as team, i}
						<tr class="border-t-2 border-secondary-color">
							<th class="border-r-2 border-secondary-color">{i + 1 + '.'}</th>
							<th class="border-r-2 border-secondary-color flex-row items-center justify-center">
								{team.name}
								<div class="inline-block w-3 h-3 div-team-{team.color}" />
							</th>
							<th class="border-r-2 border-secondary-color">{getPointsFromTeamStats(team)}</th>
							<th>{team.wins}</th>
							<th>{team.draws}</th>
							<th>{team.losses}</th>
						</tr>
					{/each}
				</tbody>
			</table>
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
{:else}
	<Content />
{/if}
