<script lang="ts">
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';
	import Content from '$lib/components/index/Content.svelte';
	import Season from '$lib/components/index/Season.svelte';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { PlayerStats, TeamStats } from '$lib/types/newTypes';

	function combinePropertyFromMatches<T extends keyof Tables<'matches'>>(
		matches: Tables<'matches'>[] | undefined,
		propertyName: T
	): number[] {
		if (!matches || matches.length === 0) {
			return [];
		}

		return matches.reduce<number[]>((accumulator, currentMatch) => {
			const propertyValue = currentMatch[propertyName];
			if (propertyValue) {
				return accumulator.concat(propertyValue);
			}
			return accumulator;
		}, []);
	}

	// Get data from server if logged in
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ session, season, teams, fantasyTeams, matches } = data);

	const calculatePlayerStats = (): PlayerStats[] => {
		let goal_ids = combinePropertyFromMatches(matches, 'goals_player_ids');
		let assist_ids = combinePropertyFromMatches(matches, 'assists_player_ids');
		let clutch_ids = combinePropertyFromMatches(matches, 'clutches_player_ids');

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
		if (!teams || teams.length === 0) return [];

		let teamStats: TeamStats[] = teams.map((team) => {
			return {
				team_id: team.id,
				wins: 0,
				losses: 0,
				draws: 0
			};
		});

		matches?.forEach((match) => {
			// not sure why i have to add the !! operator to teams here, they should not be undefined
			// due to the above check
			// actually all these !! operators are disgusting but i sucky sucky typescript
			// may be an idea to just remove nullables in the database and give better defaults
			let homeTeam = teams!!.find((team) => match.team_home_id == team.id);
			let awayTeam = teams!!.find((team) => match.team_away_id == team.id);

			let homeTeamStats = teamStats!!.find((teamStat) => match.team_home_id == teamStat.team_id);
			let awayTeamStats = teamStats!!.find((teamStat) => match.team_away_id == teamStat.team_id);

			let homeTeamGoals = match.goals_player_ids?.filter((goalId) => homeTeam?.player_ids.includes(goalId)).length || 0;
			let awayTeamGoals = match.goals_player_ids?.filter((goalId) => awayTeam?.player_ids.includes(goalId)).length || 0;

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
