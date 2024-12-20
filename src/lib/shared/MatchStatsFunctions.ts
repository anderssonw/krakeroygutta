import type { Tables } from '$lib/types/database.helper.types';
import type {
	FullPlayer,
	MatchStatsQuery,
	PlayerStatsSeason,
	PlayerStatsSeasonSummary,
	StandardPlayer,
	TeamWithStats
} from '$lib/types/newTypes';



export const getGoalsForTeamsInMatch = (match: MatchStatsQuery) => {
	let homeTeamGoals = match.home_team.players.reduce((goalSum, player) => {
		return goalSum + player.goals;
	}, 0);

	let awayTeamGoals = match.away_team.players.reduce((goalSum, player) => {
		return goalSum + player.goals;
	}, 0);

	return {
		homeTeamGoals,
		awayTeamGoals
	};
};


/*
export const getTeamStatsFromMatches = (teams: Tables<'teams'>[], matches: MatchStatsQuery[] | null | undefined): TeamWithStats[] => {
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
		let goals = getGoalsForTeamsInMatch(match);

		let homeTeamStats = getTeamStatsFromId(match.home_team.team_id);
		let awayTeamStats = getTeamStatsFromId(match.away_team.team_id);

		if (!homeTeamStats) return;
		if (!awayTeamStats) return;

		if (goals.homeTeamGoals === goals.awayTeamGoals) {
			homeTeamStats.draws++;
			awayTeamStats.draws++;
		} else if (goals.homeTeamGoals > goals.awayTeamGoals) {
			homeTeamStats.wins++;
			awayTeamStats.losses++;
		} else if (goals.awayTeamGoals > goals.homeTeamGoals) {
			homeTeamStats.losses++;
			awayTeamStats.wins++;
		}

		return;
	});

	return teamStats;
};
*/

/*
export const getTotalPointsForPlayers = (matches: MatchStatsQuery[], season: Tables<'seasons'> | null) => {
	let playerPointsMap: number[] = [];

	if (!season) return playerPointsMap;

	const victoryPoints = season.points_per_win;
	const cleanSheetPoints = season.points_per_clean_sheet;

	const goalPointFactor = season.points_per_goal;
	const assistPointFactor = season.points_per_assist;
	const clutchPointFactor = season.points_per_clutch;

	// Initialise all players in the playerPointsMap
	matches.forEach((match) => {
		match.home_team.players.concat(match.away_team.players).forEach((player) => {
			if (!playerPointsMap[player.id]) {
				playerPointsMap[player.id] = 0;
			}
		});
	});

	matches.forEach((match) => {
		let goals = getGoalsForTeamsInMatch(match);
		let homeTeamPlayers = match.home_team.players;
		let awayTeamPlayers = match.away_team.players;

		// Victory
		if (goals.homeTeamGoals > goals.awayTeamGoals) {
			homeTeamPlayers.forEach((player) => {
				playerPointsMap[player.id] += victoryPoints;
			});
		} else if (goals.awayTeamGoals > goals.homeTeamGoals) {
			awayTeamPlayers.forEach((player) => {
				playerPointsMap[player.id] += victoryPoints;
			});
		}

		// Clean sheets
		if (goals.awayTeamGoals === 0) {
			homeTeamPlayers.forEach((player) => {
				playerPointsMap[player.id] += cleanSheetPoints;
			});
		}
		if (goals.homeTeamGoals === 0) {
			awayTeamPlayers.forEach((player) => {
				playerPointsMap[player.id] += cleanSheetPoints;
			});
		}

		let allPlayersInMatch = homeTeamPlayers.concat(awayTeamPlayers);

		allPlayersInMatch.forEach((player) => {
			playerPointsMap[player.id] +=
				player.goals * goalPointFactor + player.assists * assistPointFactor + player.clutches * clutchPointFactor;
		});
	});

	return playerPointsMap;
};
*/


export const getTotalStatsForPlayer = (players: StandardPlayer[], matches: MatchStatsQuery[], season: Tables<'seasons'> | null) => {
	const playerMap = new Map<number, PlayerStatsSeasonSummary>();

	if (!season) return [];

	const victoryPoints = season.points_per_win;
	const cleanSheetPoints = season.points_per_clean_sheet;

	const goalPointFactor = season.points_per_goal;
	const assistPointFactor = season.points_per_assist;
	const clutchPointFactor = season.points_per_clutch;

	// Initialise all players in the playerPointsMap
	players.forEach((player) => {
		const createStats: PlayerStatsSeasonSummary = {
			season_id: season.id,
			player_id: player.id,
			player_name: player.name,
			player_image: player.image,
			goals: 0,
			assists: 0,
			clutches: 0,
			wins: 0,
			clean_sheets: 0,
			points: 0
		};
		playerMap.set(player.id, createStats);
	});

	matches.forEach((match) => {
		let goals = getGoalsForTeamsInMatch(match);
		let homeTeamPlayers = match.home_team.players;
		let awayTeamPlayers = match.away_team.players;

		// Victory
		if (goals.homeTeamGoals > goals.awayTeamGoals) {
			homeTeamPlayers.forEach((player) => {
				let updateWins = playerMap.get(player.id);
				if (updateWins) {
					updateWins.wins += 1;
					updateWins.points += victoryPoints;
					playerMap.set(player.id, updateWins);
				}
			});
		} else if (goals.awayTeamGoals > goals.homeTeamGoals) {
			awayTeamPlayers.forEach((player) => {
				let updateWins = playerMap.get(player.id);
				if (updateWins) {
					updateWins.wins += 1;
					updateWins.points += victoryPoints;
					playerMap.set(player.id, updateWins);
				}
			});
		}

		// Clean sheets
		if (goals.awayTeamGoals === 0) {
			homeTeamPlayers.forEach((player) => {
				let updateCs = playerMap.get(player.id);
				if (updateCs) {
					updateCs.clean_sheets += 1;
					updateCs.points += cleanSheetPoints;
					playerMap.set(player.id, updateCs);
				}
			});
		}
		if (goals.homeTeamGoals === 0) {
			awayTeamPlayers.forEach((player) => {
				let updateCs = playerMap.get(player.id);
				if (updateCs) {
					updateCs.clean_sheets += 1;
					updateCs.points += cleanSheetPoints;
					playerMap.set(player.id, updateCs);
				}
			});
		}

		let allPlayersInMatch = homeTeamPlayers.concat(awayTeamPlayers);

		allPlayersInMatch.forEach((player) => {
			let updateGoalsAssistClutch = playerMap.get(player.id);
			if (updateGoalsAssistClutch) {
				updateGoalsAssistClutch.goals += player.goals;
				updateGoalsAssistClutch.assists += player.assists;
				updateGoalsAssistClutch.clutches += player.clutches;
				updateGoalsAssistClutch.points +=
					player.goals * goalPointFactor + player.assists * assistPointFactor + player.clutches * clutchPointFactor;
				playerMap.set(player.id, updateGoalsAssistClutch);
			}
		});
	});

	let listOfPlayerStats = [];
	for (let value of playerMap.values()) {
		listOfPlayerStats.push(value);
	}

	listOfPlayerStats.sort((a, b) => b.points - a.points);

	return listOfPlayerStats;
};


/*
function initSeasonMap(matches: MatchStatsQuery[]): Map<number, PlayerStatsSeason> {
	let seasonMap: Map<number, PlayerStatsSeason> = new Map<number, PlayerStatsSeason>();

	matches.forEach((match) => {
		if (!seasonMap.has(match.season_id)) {
			let initPlayerStats: PlayerStatsSeason = {
				season_id: match.season_id,
				season_name: match.season_name,
				goals: 0,
				assists: 0,
				clutches: 0,
				wins: 0,
				clean_sheets: 0,
				games: 0
			};
			seasonMap.set(match.season_id, initPlayerStats);
		}
	});

	return seasonMap;
}

function mapToSortedArray(seasonMap: Map<number, PlayerStatsSeason>): PlayerStatsSeason[] {
	let seasonArray = Array.from(seasonMap);
	let sortedArray = seasonArray.sort((a, b) => b[0] - a[0]);

	let sortedSeasonStats: PlayerStatsSeason[] = [];
	sortedArray.forEach((sa) => {
		sortedSeasonStats.push(sa[1]); // 1 => the value in the original map
	});

	return sortedSeasonStats;
}
*/

/*
export function fillSeasonMapWithStatsForPlayer(matches: MatchStatsQuery[], playerVersions: FullPlayer[]): PlayerStatsSeason[] {
	let seasonMap: Map<number, PlayerStatsSeason> = initSeasonMap(matches);

	for (const match of matches) {
		let curSeasonPlayer = playerVersions?.find((version) => version.season_id == match.season_id);
		if (!curSeasonPlayer) {
			continue;
		}

		let curStats = seasonMap.get(match.season_id)!;

		let curGoals = curStats.goals;
		let curAssists = curStats.assists;
		let curClutches = curStats.clutches;
		let curWins = curStats.wins;
		let curCleans = curStats.clean_sheets;

		let homeTeamGoals = 0;
		let partOfHomeTeam = false;
		let awayTeamGoals = 0;
		let partOfAwayTeam = false;

		match.home_team.players.forEach((home_player) => {
			homeTeamGoals += home_player.goals;
			if (home_player.id == curSeasonPlayer?.player_id) {
				// Change to curSeasonId
				curGoals += home_player.goals;
				curAssists += home_player.assists;
				curClutches += home_player.clutches;
				partOfHomeTeam = true;
			}
		});
		match.away_team.players.forEach((away_player) => {
			awayTeamGoals += away_player.goals;
			if (away_player.id == curSeasonPlayer?.player_id) {
				// Change to curSeasonId
				curGoals += away_player.goals;
				curAssists += away_player.assists;
				curClutches += away_player.clutches;
				partOfAwayTeam = true;
			}
		});

		if (homeTeamGoals > awayTeamGoals && partOfHomeTeam) {
			curWins += 1;
		}
		if (awayTeamGoals > homeTeamGoals && partOfAwayTeam) {
			curWins += 1;
		}
		if (awayTeamGoals == 0 && partOfHomeTeam) {
			curCleans += 1;
		}
		if (homeTeamGoals == 0 && partOfAwayTeam) {
			curCleans += 1;
		}

		let updatedStats = {
			...curStats,
			goals: curGoals,
			assists: curAssists,
			clutches: curClutches,
			wins: curWins,
			clean_sheets: curCleans
		};
		seasonMap.set(match.season_id, updatedStats);
	}

	return mapToSortedArray(seasonMap);
}
*/