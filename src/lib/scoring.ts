import type { Season } from './types/database-helpers';
import type { SeasonPlayerStats, SeasonPlayerFullStats } from './types/player';
import type { TeamStatistics } from './types/team';

/**
 * Calculates the total score for a player in a season based on their stats
 *
 * @param stats - Player statistics (goals, assists, clutches, etc.)
 * @param season - Season containing point multipliers
 * @returns Total calculated score for the player
 */
export function calculatePlayerScore(
	stats: {
		goals: number;
		assists: number;
		clutches: number;
		victories: number;
		cleanSheets: number;
	},
	season: Season
): number {
	const { points_per_goal, points_per_assist, points_per_clutch, points_per_win, points_per_clean_sheet } = season;

	return (
		stats.goals * points_per_goal +
		stats.assists * points_per_assist +
		stats.clutches * points_per_clutch +
		stats.cleanSheets * points_per_clean_sheet +
		stats.victories * points_per_win
	);
}

/**
 * Enhances basic player statistics with calculated team stats (victories, clean sheets)
 * and total score
 *
 * @param playerStats - Array of basic player statistics
 * @param teamStats - Array of team statistics containing victories and clean sheets
 * @param season - Season containing point multipliers
 * @returns Array of full player statistics including calculated scores
 */
export function calculateFullPlayerStats(
	playerStats: SeasonPlayerStats[],
	teamStats: TeamStatistics[],
	season: Season
): SeasonPlayerFullStats[] {
	return playerStats.map((ps) => {
		let victories = 0;
		let cleanSheets = 0;

		// Sum up victories and clean sheets from all teams the player is on
		teamStats.forEach((ts) => {
			if (ts.playersIds.includes(ps.id)) {
				victories += ts.wins;
				cleanSheets += ts.cleanSheets;
			}
		});

		const totalScore = calculatePlayerScore(
			{
				goals: ps.goals,
				assists: ps.assists,
				clutches: ps.clutches,
				victories,
				cleanSheets
			},
			season
		);

		return {
			...ps,
			victories,
			cleanSheets,
			totalScore
		};
	});
}

/**
 * Calculates the score for a fantasy team
 *
 * @param playerIds - Array of player IDs in the fantasy team
 * @param captainId - ID of the team captain (gets double points)
 * @param allPlayerStats - Array of all player statistics
 * @returns Total fantasy team score
 */
export function calculateFantasyTeamScore(playerIds: number[], captainId: number | null, allPlayerStats: SeasonPlayerFullStats[]): number {
	return playerIds.reduce((acc, playerId) => {
		const playerStat = allPlayerStats.find((ps) => ps.id === playerId);

		if (!playerStat) {
			return acc;
		}

		// Captain gets double points
		const multiplier = playerId === captainId ? 2 : 1;
		return acc + playerStat.totalScore * multiplier;
	}, 0);
}
