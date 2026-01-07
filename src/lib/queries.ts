import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database.generated.types';
import type { Season, SeasonPlayerStatisticsView, SeasonTeamStatisticsView } from './types/database-helpers';
import type { SeasonPlayer, SeasonPlayerFullStats, SeasonPlayerStats } from './types/player';
import { defer, supabaseQuery } from './supabaseClient';
import type { MatchDetails } from './types/match';
import type { TeamStatistics, TeamWithPlayers } from './types/team';
import { calculateFullPlayerStats } from './scoring';

/**
 * Helper function to map player data to SeasonPlayer format
 */
function mapToSeasonPlayer(playerData: Omit<SeasonPlayer, 'team'>, team: SeasonPlayer['team']): SeasonPlayer {
	return {
		...playerData,
		team
	};
}

function mapToSeasonPlayerStats(playerData: Omit<SeasonPlayerStats, 'team'>, team: SeasonPlayerStats['team']): SeasonPlayerStats {
	return {
		...playerData,
		team
	};
}

function teamFromPlayerSeasonData(playerSeasonData: SeasonPlayerStatisticsView): SeasonPlayer['team'] | null {
	if (playerSeasonData.team_id && playerSeasonData.team_name && playerSeasonData.team_color) {
		return {
			id: playerSeasonData.team_id,
			name: playerSeasonData.team_name,
			color: playerSeasonData.team_color
		};
	}

	return null;
}

export function fetchAllSeasons(supabase: SupabaseClient<Database>): Promise<Season[]> {
	return defer<Season[]>(async () => {
		const seasons = await supabaseQuery(
			supabase.from('seasons').select('*').order('start_time', { ascending: false }),
			'Error fetching seasons'
		);

		if (!seasons) {
			return [];
		}

		return seasons.map((season) => ({
			...season,
			start_time: new Date(season.start_time),
			end_time: new Date(season.end_time),
			deadline_time: new Date(season.deadline_time)
		}));
	});
}

export function fetchAllMatchesForSeason(supabase: SupabaseClient<Database>, seasonId: number) {
	return defer<MatchDetails[]>(async () => {
		const matchesData = await supabaseQuery(
			supabase
				.from('matches')
				.select(
					`
        *,
        home_team:teams!team_home_id (*, players:teams_players(player_id, ...players!player_id(name))),
        away_team:teams!team_away_id (*, players:teams_players(player_id, ...players!player_id(name))),
        goals(
					id,
          goal_player:players!goal_player_id(*),
          assist_player:players!assist_player_id(*)
        ),
        clutches(
          id,
          player:players(*),
					is_negative
        )
      `
				)
				.eq('season_id', seasonId)
		);

		if (!matchesData) {
			return [];
		}

		const matches: MatchDetails[] = matchesData.map((match) => ({
			id: match.id,
			home_team: {
				id: match.home_team.id,
				color: match.home_team.color,
				name: match.home_team.name,
				players: match.home_team.players.map((p) => ({ player_id: p.player_id, name: p.name }))
			},
			away_team: {
				id: match.away_team.id,
				color: match.away_team.color,
				name: match.away_team.name,
				players: match.away_team.players.map((p) => ({ player_id: p.player_id, name: p.name }))
			},
			goals: match.goals.map((goal) => ({
				id: goal.id,
				goal_player_id: goal.goal_player.id,
				assist_player_id: goal.assist_player?.id ?? null
			})),
			clutches: match.clutches.map((clutch) => ({
				id: clutch.id,
				clutch_player_id: clutch.player.id,
				is_negative: clutch.is_negative
			}))
		}));

		return matches;
	});
}

export function fetchAllTeamsForSeason(supabase: SupabaseClient<Database>, seasonId: number) {
	return defer<TeamWithPlayers[]>(async () => {
		const teamsData = await supabaseQuery(supabase.from('teams').select('*, teams_players(*)').eq('season_id', seasonId));

		if (!teamsData) {
			return [];
		}

		const teams: TeamWithPlayers[] = teamsData.map((team) => ({
			id: team.id,
			name: team.name,
			color: team.color,
			season_id: team.season_id,
			playersIds: team.teams_players.map((teamPlayer) => teamPlayer.player_id)
		}));

		return teams;
	});
}

/**
 * Fetch all players for a given season with their team information
 */
export function fetchSeasonPlayersWithTeams(supabase: SupabaseClient<Database>, season: Season): Promise<SeasonPlayer[]> {
	return defer<SeasonPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('season_player_statistics').select('*').eq('season_id', season.id),
			'Error fetching season players with teams'
		);

		if (!players) {
			return [];
		}

		return (players as SeasonPlayerStatisticsView[]).map((playerStat): SeasonPlayer => {
			const team = teamFromPlayerSeasonData(playerStat);

			return mapToSeasonPlayer(playerStat, team);
		});
	});
}

/**
 * Fetch a player for all seasons with their team information
 */
export function fetchAllSeasonsPlayerWithTeam(supabase: SupabaseClient<Database>, playerId: number): Promise<SeasonPlayer[]> {
	return defer<SeasonPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('season_player_statistics').select('*').eq('player_id', playerId),
			'Error fetching player for all seasons'
		);

		if (!players) {
			return [];
		}

		return (players as SeasonPlayerStatisticsView[]).map((playerStat): SeasonPlayer => {
			const team = teamFromPlayerSeasonData(playerStat);

			return mapToSeasonPlayer(playerStat, team);
		});
	});
}

/**
 * Fetch all players every season with their team information
 */
export function fetchAllSeasonsPlayersWithTeam(supabase: SupabaseClient<Database>): Promise<SeasonPlayer[]> {
	return defer<SeasonPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('season_player_statistics').select('*'),
			'Error fetching all players for all seasons'
		);

		if (!players) {
			return [];
		}

		return (players as SeasonPlayerStatisticsView[]).map((playerStat): SeasonPlayer => {
			const team = teamFromPlayerSeasonData(playerStat);

			return mapToSeasonPlayer(playerStat, team);
		});
	});
}

export function fetchSeasonStatistics(
	supabase: SupabaseClient<Database>,
	season: Season
): Promise<{ fullPlayerStats: SeasonPlayerFullStats[]; teamStats: TeamStatistics[] }> {
	return defer(async () => {
		const [playerStats, teamStats] = await Promise.all([
			supabaseQuery(supabase.from('season_player_statistics').select('*').eq('season_id', season.id), 'Error fetching player statistics'),
			supabaseQuery(supabase.from('season_team_statistics').select('*').eq('season_id', season.id), 'Error fetching team statistics')
		]);

		if (!playerStats || !teamStats) {
			return { fullPlayerStats: [], teamStats: [] };
		}

		const cleanedPlayerStats: SeasonPlayerStats[] = (playerStats as SeasonPlayerStatisticsView[]).map((playerStat) => {
			const team = teamFromPlayerSeasonData(playerStat);

			return mapToSeasonPlayerStats(playerStat, team);
		});

		const cleanedTeamStats: TeamStatistics[] = (teamStats as SeasonTeamStatisticsView[]).map((teamStat) => ({
			id: teamStat.id,
			name: teamStat.name,
			color: teamStat.color,
			season_id: teamStat.season_id,
			playersIds: cleanedPlayerStats
				.map((playerStat) => (playerStat.team && playerStat.team.id === teamStat.id ? playerStat.id : null))
				.filter((id): id is number => id !== null),
			wins: teamStat.wins,
			losses: teamStat.losses,
			ties: teamStat.ties,
			cleanSheets: teamStat.clean_sheets
		}));

		const fullPlayerStats = calculateFullPlayerStats(cleanedPlayerStats, cleanedTeamStats, season);

		return { fullPlayerStats, teamStats: cleanedTeamStats };
	});
}

/**
 * Fetch statistics for a specific player across all seasons
 * Includes calculated scores based on team performance (victories, clean sheets)
 */
export function fetchPlayerStatisticsAllSeasons(supabase: SupabaseClient<Database>, playerId: number): Promise<SeasonPlayerFullStats[]> {
	return defer(async () => {
		const [seasonsData, playerStats, teamStats] = await Promise.all([
			supabaseQuery(supabase.from('seasons').select('*').order('start_time', { ascending: false }), 'Error fetching seasons'),
			supabaseQuery(supabase.from('season_player_statistics').select('*').eq('id', playerId), 'Error fetching player statistics'),
			supabaseQuery(supabase.from('season_team_statistics').select('*'), 'Error fetching team statistics')
		]);

		if (!seasonsData || !playerStats || !teamStats || playerStats.length === 0) {
			return [];
		}

		const seasons: Season[] = seasonsData.map((season) => ({
			...season,
			start_time: new Date(season.start_time),
			end_time: new Date(season.end_time),
			deadline_time: new Date(season.deadline_time)
		}));

		return seasons.flatMap((season) => {
			const seasonId = season.id;

			const playerStat = (playerStats as SeasonPlayerStatisticsView[]).find((stat) => stat.season_id === seasonId);
			if (!playerStat) {
				return [];
			}

			const seasonTeamStats = (teamStats as SeasonTeamStatisticsView[]).filter((stat) => stat.season_id === seasonId);
			const team = teamFromPlayerSeasonData(playerStat);
			const cleanedPlayerStat = mapToSeasonPlayerStats(playerStat, team);
			const cleanedTeamStats: TeamStatistics[] = seasonTeamStats.map((teamStat) => ({
				id: teamStat.id,
				name: teamStat.name,
				color: teamStat.color,
				season_id: teamStat.season_id,
				playersIds: cleanedPlayerStat.team && cleanedPlayerStat.team.id === teamStat.id ? [cleanedPlayerStat.id] : [],
				wins: teamStat.wins,
				losses: teamStat.losses,
				ties: teamStat.ties,
				cleanSheets: teamStat.clean_sheets
			}));

			return calculateFullPlayerStats([cleanedPlayerStat], cleanedTeamStats, season);
		});
	});
}
