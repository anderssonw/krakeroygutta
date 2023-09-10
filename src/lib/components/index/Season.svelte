<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { PlayerStats, TeamStats } from '$lib/types/newTypes';
	import SeasonButton from './SeasonButton.svelte';

	interface MergedTeam {
		name: string;
		color: string | null;
		wins: number;
		losses: number;
		draws: number;
		points: number;
	}

	/* TODO: */
	// Update visuals (background, video, player/team buttons, tables)
	// Get color for teams to work (might need client loading?, use await?)

	interface FantasyTeamWithPlayers extends Tables<'fantasy_teams'> {
		fantasy_teams_players: {
			player_id: number;
		}[];
	}

	// Get specifics, can be used in script
	export let season: Tables<'seasons'>;
	export let teams: Tables<'teams'>[];
	export let fantasyTeams: FantasyTeamWithPlayers[];
	export let playerStats: PlayerStats[];
	export let teamStats: TeamStats[];

	$: mergedTeams = mergeTeamAndTeamStats(teams, teamStats);

	$: sortedFantasyTeams = sortFantasyTeams();

	// this is lol, should probably store it in a variable or something and then use that,
	// instead of calling getTotalPointsForFantasyTeam for sorting AND the points later
	const sortFantasyTeams = () => {
		return fantasyTeams.sort((a, b) => getTotalPointsForFantasyTeam(b, playerStats) - getTotalPointsForFantasyTeam(a, playerStats));
	};

	function getTotalPointsForFantasyTeam(fantasyTeam: FantasyTeamWithPlayers, playerStats: PlayerStats[]): number {
		let points: number = 0;

		fantasyTeam.fantasy_teams_players.forEach((player) => {
			let playerStat = playerStats.find((playerPoint) => playerPoint.player_id == player.player_id);

			// ugly bugly
			points += (playerStat?.assists || 0) + (playerStat?.clutches || 0) + (playerStat?.goals || 0);
		});
		return points;
	}

	function mergeTeamAndTeamStats(teams: Tables<'teams'>[], teamStats: TeamStats[]): MergedTeam[] {
		if (teams.length !== teamStats.length) {
			console.log('fucko boingo');
			return [];
		}

		return teams.map((team) => {
			let teamStat = teamStats.find((teamStat) => team.id === teamStat.team_id);
			if (teamStat) {
				return {
					name: team.name,
					color: team.color,
					wins: teamStat.wins,
					draws: teamStat.draws,
					losses: teamStat.losses,
					points: teamStat.wins * 3 + teamStat.draws
				};
			} else {
				return {
					name: 'fucko boingo',
					color: 'fucko boingo',
					wins: 0,
					draws: 0,
					losses: 0,
					points: 0
				};
			}
		});
	}
</script>

<div class="structure">
	<div class="w-full h-[44vw] laptop:h-128">
		<video width="100%" autoplay muted loop>
			<source src="jogabonito.mp4" type="video/mp4" />
		</video>
	</div>
	{#if season}
		<div class="w-[90%] laptop:w-full tablet:2/3 flex flex-col items-center space-y-12 pb-12">
			<h2>{season.name}</h2>
			<table class="table-auto w-full bg-secondary-color-light text-primary-color-dark rounded-lg">
				<thead>
					<tr class="border-b-4 border-secondary-color-dark">
						<th class="border-r-4 border-secondary-color-dark">Pos</th>
						<th class="border-r-4 border-secondary-color-dark">Team</th>
						<th>GP</th>
						<th>W</th>
						<th>D</th>
						<th>L</th>
					</tr>
				</thead>
				<tbody>
					{#each mergedTeams.sort((a, b) => b.points - a.points) as team, i}
						<tr class="border-t-2 border-secondary-color">
							<th class="border-r-2 border-secondary-color">{i + 1 + '.'}</th>
							<th class="border-r-2 border-secondary-color flex-row items-center justify-center">
								{team.name}
								<div class="inline-block w-3 h-3 bg-{team.color}-500" />
							</th>
							<th>{team.points}</th>
							<th>{team.wins}</th>
							<th>{team.draws}</th>
							<th>{team.losses}</th>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="w-full grid grid-cols-2 laptop:grid-cols-4 gap-4">
				<SeasonButton image="players_btn.png" route="Players" />
				<SeasonButton image="teams_btn.png" route="Teams" />
				<SeasonButton image="matches_btn.png" route="Matches" />
				<SeasonButton image="bets_btn.png" route="Bets" />
			</div>
		</div>

		<div class="relative w-full bg-primary-color flex flex-col items-center space-y-12 justify-center pb-60 rounded-t-[25%]">
			<h2>Fantasy Standings</h2>
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
						{#each sortedFantasyTeams as team, i}
							<tr>
								<th>{i + 1 + '.'}</th>
								<th>{team.name}</th>
								<th>{getTotalPointsForFantasyTeam(team, playerStats)}</th>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<h2>No active season</h2>
	{/if}
</div>

<style>
	video {
		position: relative;
		transform-origin: 0 0;
		transform: scaleY(0.6);
	}
</style>
