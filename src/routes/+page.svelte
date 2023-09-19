<script lang="ts">
	// Get data from server if logged in
	import Content from '$lib/components/index/Content.svelte';
	import jogaVideo from '$lib/assets/jogabonito.mp4';
	import type { PageData } from './$types';
	import SeasonButton from '$lib/components/index/SeasonButton.svelte';
	import type { MatchStatsPlayer, MatchStatsQuery, TeamWithStats } from '$lib/types/newTypes';
	import type { Tables } from '$lib/types/database.helper.types';

	export let data: PageData;
	$: ({ session, season, teams, matches, lazy } = data);

	const getPointsFromTeamStats = (team: TeamWithStats) => {
		return team.wins * 3 + team.draws;
	};

	const getTeamStatsFromMatches = (teams: Tables<'teams'>[], matches: MatchStatsQuery[] | null | undefined): TeamWithStats[] => {
		let teamStats: TeamWithStats[] = teams.map((team) => {
			return {
				team_id: team.id,
				wins: 0,
				losses: 0,
				draws: 0,
				color: team.color,
				name: team.name
			};
		});

		const getTeamStatsFromId = (team_id: number) => {
			return teamStats.find((team) => team.team_id === team_id);
		};

		if (!matches) return [];

		matches.forEach((match) => {
			let homeTeamGoals = match.home_team.players.reduce((goalSum, player) => {
				return goalSum + player.goals;
			}, 0);

			let awayTeamGoals = match.away_team.players.reduce((goalSum, player) => {
				return goalSum + player.goals;
			}, 0);

			let homeTeamStats = getTeamStatsFromId(match.home_team.id);
			let awayTeamStats = getTeamStatsFromId(match.away_team.id);

			if (!homeTeamStats) return;
			if (!awayTeamStats) return;

			if (homeTeamGoals === awayTeamGoals) {
				homeTeamStats.draws++;
				awayTeamStats.draws++;
			} else if (homeTeamGoals > awayTeamGoals) {
				homeTeamStats.wins++;
				awayTeamStats.losses++;
			} else if (awayTeamGoals > homeTeamGoals) {
				homeTeamStats.losses++;
				awayTeamStats.wins++;
			}

			return;
		});

		return teamStats;
	};

	interface FantasyTeamWithPlayers extends Tables<'fantasy_teams'> {
		fantasy_teams_players: {
			player_id: number;
		}[];
		points?: number;
	}

	interface FantasyTeamFull extends FantasyTeamWithPlayers {
		points: number;
	}

	// Helper function as this is done for both the home and away team,
	const addPointsFromMatchToPlayerMap = (playerMap: number[], players: MatchStatsPlayer[]) => {
		players.forEach((player) => {
			if (!playerMap[player.id]) {
				playerMap[player.id] = 0;
			}

			playerMap[player.id] += player.goals + player.assists + player.clutches;
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
			<table class="table-auto w-full bg-secondary-color-light text-primary-color-dark rounded-lg">
				<thead>
					<tr class="border-b-4 border-secondary-color-dark">
						<th class="border-r-4 border-secondary-color-dark">Posisjon</th>
						<th class="border-r-4 border-secondary-color-dark">Lag</th>
						<th>Poeng</th>
						<th>W</th>
						<th>D</th>
						<th>L</th>
					</tr>
				</thead>
				<tbody>
					{#each getTeamStatsFromMatches(teams, matches).sort((a, b) => getPointsFromTeamStats(b) - getPointsFromTeamStats(a)) as team, i}
						<tr class="border-t-2 border-secondary-color">
							<th class="border-r-2 border-secondary-color">{i + 1 + '.'}</th>
							<th class="border-r-2 border-secondary-color flex-row items-center justify-center">
								{team.name}
								<div class="inline-block w-3 h-3 bg-{team.color}-500" />
							</th>
							<th>{getPointsFromTeamStats(team)}</th>
							<th>{team.wins}</th>
							<th>{team.draws}</th>
							<th>{team.losses}</th>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="w-full grid grid-cols-2 laptop:grid-cols-4 gap-4">
				<SeasonButton image="players" route="Players" />
				<SeasonButton image="teams" route="Teams" />
				<SeasonButton image="matches" route="Matches" />
				<SeasonButton image="bets" route="Bets" />
			</div>

			<div class="relative w-full bg-primary-color flex flex-col items-center space-y-12 justify-center pb-60 rounded-t-[25%]">
				<h2>Fantasy Standings</h2>

				{#await lazy?.fantasyTeams}
					<div class="container max-w-screen-laptop animate-pulse">
						<table class="table-fixed w-full">
							<thead>
								<tr>
									<th />
									<th />
									<th />
								</tr>
							</thead>
							<tbody>
								{#each { length: 4 } as _}
									<tr>
										<th />
										<th />
										<th />
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:then fantasyTeams}
					<div class="container max-w-screen-laptop">
						<table class="table-fixed w-full">
							<thead>
								<tr>
									<th>Posisjon</th>
									<th>Lag</th>
									<th>Poeng</th>
								</tr>
							</thead>
							<tbody>
								{#each getFantasyTeamsWithPoints(fantasyTeams ?? []) as team, i}
									<tr>
										<th>{i + 1 + '.'}</th>
										<th>{team.name}</th>
										<th>{team.points}</th>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:catch error}
					<p>Noe gikk galt under henting av Fantasy-lag</p>
					<p>{error}</p>
				{/await}
			</div>
		{:else}
			<p>No season active</p>
		{/if}
	</div>
{:else}
	<Content />
{/if}
