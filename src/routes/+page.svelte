<script lang="ts">
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';
	import Content from '$lib/components/index/Content.svelte';
	import Season from '$lib/components/index/Season.svelte';
	import type { PlayerStats, TeamStats } from '$lib/types/newTypes';

	// Get data from server if logged in
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ session, season, teams, fantasyTeams, matches } = data);

	const calculatePlayerStats = (): PlayerStats[] => {
		if (!matches) return [];

		let goal_ids = matches?.map((match) => match.goals.map((goal) => goal.player_id))[0];
		let assist_ids = matches?.map((match) => match.assists.map((assist) => assist.player_id))[0];
		let clutch_ids = matches?.map((match) => match.clutches.map((clutch_ids) => clutch_ids.player_id))[0];

		// creates an initial playerpoints array with all values from the above ids in a unique set
		// we should probably get all players a different way this is a proof of concept
		let playerPoints: PlayerStats[] = [...new Set(goal_ids.concat(assist_ids).concat(clutch_ids))].map((id) => {
			return {
				player_id: id,
				goals: 0,
				assists: 0,
				clutches: 0
			};
		});

		// can generify
		goal_ids.forEach((id) => {
			let player = playerPoints.find((player) => player.player_id === id);

			if (player) {
				player.goals++;
			}
		});

		assist_ids.forEach((id) => {
			let player = playerPoints.find((player) => player.player_id === id);

			if (player) {
				player.assists++;
			}
		});

		clutch_ids.forEach((id) => {
			let player = playerPoints.find((player) => player.player_id === id);

			if (player) {
				player.clutches++;
			}
		});

		return playerPoints;
	};

	const calculateTeamStats = (): TeamStats[] => {
		if (!matches) return [];
		if (!teams || teams.length === 0) return [];

		let teamStats: TeamStats[] = teams.map((team) => {
			return {
				team_id: team.id,
				wins: 0,
				losses: 0,
				draws: 0
			};
		});

		matches.forEach((match) => {
			// not sure why i have to add the !! operator to teams here, they should not be undefined
			// due to the above check
			// actually all these !! operators are disgusting but i sucky sucky typescript
			// may be an idea to just remove nullables in the database and give better defaults
			let homeTeam = teams!!.find((team) => match.team_home_id == team.id);
			let awayTeam = teams!!.find((team) => match.team_away_id == team.id);

			let homeTeamStats = teamStats!!.find((teamStat) => match.team_home_id == teamStat.team_id);
			let awayTeamStats = teamStats!!.find((teamStat) => match.team_away_id == teamStat.team_id);

			let homeTeamGoals =
				match.goals?.filter((goal) => homeTeam?.teams_players.map((player) => player.player_id).includes(goal.player_id)).length || 0;
			let awayTeamGoals =
				match.goals?.filter((goal) => awayTeam?.teams_players.map((player) => player.player_id).includes(goal.player_id)).length || 0;

			if (homeTeamGoals === awayTeamGoals) {
				homeTeamStats!!.draws++;
				awayTeamStats!!.draws++;
			} else if (homeTeamGoals > awayTeamGoals) {
				homeTeamStats!!.wins++;
				awayTeamStats!!.losses++;
			} else if (awayTeamGoals > homeTeamGoals) {
				homeTeamStats!!.losses++;
				awayTeamStats!!.wins++;
			}

			return;
		});

		return teamStats;
	};
</script>

{#if session && season && teams && fantasyTeams}
	<Season {season} {teams} {fantasyTeams} playerStats={calculatePlayerStats()} teamStats={calculateTeamStats()} />
{:else}
	<Content />
{/if}
