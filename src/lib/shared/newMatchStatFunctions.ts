import type { Tables } from '$lib/types/database.helper.types';
import type { MatchStatsQuery, MatchStatsTeam, MatchSummary, MatchWithSeasonName, PlayerStatsSeason } from '$lib/types/newTypes';

// Use this to find the number of points for a specific season for a given player
export const calculateFantasyPoints = (playerStats: PlayerStatsSeason[], season: Tables<'seasons'>, is_captain: boolean): number => {
	const playerStatsForSeason = playerStats.find((ps) => ps.season_id === season.id);
	const captainFactor = is_captain ? 2 : 1;

	let totalScore = 0;
	if (playerStatsForSeason) {
		totalScore += playerStatsForSeason.wins * season.points_per_win * captainFactor;
		totalScore += playerStatsForSeason.clean_sheets * season.points_per_clean_sheet * captainFactor;
		totalScore += playerStatsForSeason.goals * season.points_per_goal * captainFactor;
		totalScore += playerStatsForSeason.assists * season.points_per_assist * captainFactor;
		totalScore += playerStatsForSeason.clutches * season.points_per_clutch * captainFactor;
	}

	return totalScore;
};

// Use this to find the stats for each season for a given player
export const mapPlayerStatistics = (matchSummary: MatchSummary[], player_id: string): PlayerStatsSeason[] => {
	const playerId = parseInt(player_id);

	let seasonPlayerStatsArray: PlayerStatsSeason[] = [];

	matchSummary.forEach((summary) => {
		const myPlayerIndex = summary.players.findIndex((p) => p.id === playerId);
		if (myPlayerIndex >= 0) {
			const myPlayer = summary.players[myPlayerIndex];

			const findExistingSeason = seasonPlayerStatsArray.findIndex((spta) => spta.season_id === summary.season_id);
			if (findExistingSeason >= 0) {
				const existingStats = { ...seasonPlayerStatsArray[findExistingSeason] };

				existingStats.goals += myPlayer.goals;
				existingStats.assists += myPlayer.assists;
				existingStats.clutches += myPlayer.clutches;
				existingStats.games += 1;
				if (summary.win) existingStats.wins += 1;
				if (summary.clean_sheet) existingStats.clean_sheets += 1;

				seasonPlayerStatsArray[findExistingSeason] = existingStats;
			} else {
				const initPlayerStats: PlayerStatsSeason = {
					season_id: summary.season_id,
					season_name: summary.season_name,
					goals: myPlayer.goals,
					assists: myPlayer.assists,
					clutches: myPlayer.clutches,
					wins: summary.win ? 1 : 0,
					clean_sheets: summary.clean_sheet ? 1 : 0,
					games: 1
				};
				seasonPlayerStatsArray.push(initPlayerStats);
			}
		}
	});

	return seasonPlayerStatsArray;
};

// This takes the combined match information from mapTeamStats() and makes a summary of the goals scored in each match
// We now have a list of matches that have been played for each season
// Each match has a list of players who was part of the match
// The match also holds information whether the players involved won or lost
// This means that a game summary of a home_team and away_team ends up being split into individual games
// For instance, there will be 2 entries on the same match_id with different players and different win/clean_sheet outcome for each
export const mapMatchSummary = (matchStats: MatchStatsQuery[]): MatchSummary[] => {
	let matchSummaries: MatchSummary[] = [];

	matchStats.forEach((matchStat) => {
		let goalsByHomeTeam = matchStat.home_team.players.reduce((init, current) => init + current.goals, 0);
		let goalsByAwayTeam = matchStat.away_team.players.reduce((init, current) => init + current.goals, 0);

		matchSummaries.push({
			match_id: matchStat.match_id,
			team_id: matchStat.home_team.team_id,
			team_name: matchStat.home_team.name,
			team_color: matchStat.home_team.color,
			season_id: matchStat.season_id,
			season_name: matchStat.season_name,
			players: matchStat.home_team.players,
			win: goalsByHomeTeam > goalsByAwayTeam,
			loss: goalsByAwayTeam > goalsByHomeTeam,
			draw: goalsByHomeTeam === goalsByAwayTeam,
			clean_sheet: goalsByAwayTeam <= 0
		});

		matchSummaries.push({
			match_id: matchStat.match_id,
			team_id: matchStat.away_team.team_id,
			team_name: matchStat.away_team.name,
			team_color: matchStat.away_team.color,
			season_id: matchStat.season_id,
			season_name: matchStat.season_name,
			players: matchStat.away_team.players,
			win: goalsByAwayTeam > goalsByHomeTeam,
			loss: goalsByHomeTeam > goalsByAwayTeam,
			draw: goalsByAwayTeam === goalsByHomeTeam,
			clean_sheet: goalsByHomeTeam <= 0
		});
	});

	return matchSummaries;
};

// This combines our matches information, where we only have the team id's with our team_match_view
// Our team_match_view holds all the information about a team for a given match, such as player statistics etc
// By combining it, we can now find out who won and whether there was any clean sheets
export const mapTeamStats = (matches: MatchWithSeasonName[], teamStats: MatchStatsTeam[]): MatchStatsQuery[] => {
	if (matches.length > 0 && teamStats.length > 0) {
		let matchStatsQueries: MatchStatsQuery[] = [];
		matches.forEach((match) => {
			let home_team = teamStats.find((ts) => ts.team_id == match.team_home_id && ts.match_id == match.id);
			let away_team = teamStats.find((ts) => ts.team_id == match.team_away_id && ts.match_id == match.id);

			const emptyStatTeam: MatchStatsTeam = {
				match_id: match.id,
				team_id: 0,
				name: '',
				color: '',
				players: [],
				season_id: match.season_id
			};

			let matchStatsQuery: MatchStatsQuery = {
				match_id: match.id,
				season_id: match.season_id,
				season_name: match.season_name.name,
				home_team: home_team ? home_team : emptyStatTeam,
				away_team: away_team ? away_team : emptyStatTeam
			};
			matchStatsQueries.push(matchStatsQuery);
		});
		return matchStatsQueries;
	}

	return [];
};
