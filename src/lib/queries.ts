import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database.generated.types';
import type { Season } from './types/database-helpers';
import type { SeasonAndTeamPlayer, SeasonPlayerFullStats, SeasonPlayerStats } from './types/player';
import { defer, supabaseQuery } from './supabaseClient';
import type { MatchDetails } from './types/match';
import type { TeamStatistics, TeamWithPlayers } from './types/team';
import { calculateFullPlayerStats } from './scoring';

/**
 * Helper types for internal processing
 */
type ProcessedMatch = {
	id: number;
	homeTeam: {
		id: number;
		players: number[];
		goals: number;
	};
	awayTeam: {
		id: number;
		players: number[];
		goals: number;
	};
};

type RawMatch = {
	id: number;
	team_home_id: number;
	team_away_id: number;
	home_team?: {
		teams_players?: { player_id: number }[];
	};
	away_team?: {
		teams_players?: { player_id: number }[];
	};
	goals?: { goal_player_id: number }[];
};

type RawTeam = {
	id: number;
	name: string;
	color: string;
	season_id: number;
	teams_players?: { player_id: number }[];
};

/**
 * Helper function to process matches data
 */
function processMatches(matches: RawMatch[] | null): ProcessedMatch[] {
	return (
		matches?.map((match) => {
			const homeTeamPlayers = match.home_team?.teams_players?.map((tp) => tp.player_id) || [];
			const awayTeamPlayers = match.away_team?.teams_players?.map((tp) => tp.player_id) || [];

			return {
				id: match.id,
				homeTeam: {
					id: match.team_home_id,
					players: homeTeamPlayers,
					goals: match.goals?.filter((g) => homeTeamPlayers.includes(g.goal_player_id)).length || 0
				},
				awayTeam: {
					id: match.team_away_id,
					players: awayTeamPlayers,
					goals: match.goals?.filter((g) => awayTeamPlayers.includes(g.goal_player_id)).length || 0
				}
			};
		}) || []
	);
}

/**
 * Helper function to process teams data
 */
function processTeams(teams: RawTeam[] | null): TeamWithPlayers[] {
	return (
		teams?.map((team) => ({
			id: team.id,
			name: team.name,
			color: team.color,
			season_id: team.season_id,
			playersIds: team.teams_players?.map((tp) => tp.player_id) || []
		})) || []
	);
}

/**
 * Helper function to calculate team statistics
 */
function calculateTeamStatistics(cleanedTeams: TeamWithPlayers[], cleanedMatches: ProcessedMatch[]): TeamStatistics[] {
	return cleanedTeams.map((team) => {
		let wins = 0;
		let cleanSheets = 0;
		let losses = 0;
		let ties = 0;

		cleanedMatches.forEach((match) => {
			const isHomeTeam = match.homeTeam.id === team.id;
			const isAwayTeam = match.awayTeam.id === team.id;

			if (isHomeTeam || isAwayTeam) {
				const teamGoals = isHomeTeam ? match.homeTeam.goals : match.awayTeam.goals;
				const opponentGoals = isHomeTeam ? match.awayTeam.goals : match.homeTeam.goals;

				if (teamGoals > opponentGoals) {
					wins += 1;
				} else if (teamGoals < opponentGoals) {
					losses += 1;
				} else {
					ties += 1;
				}

				if (opponentGoals === 0) {
					cleanSheets += 1;
				}
			}
		});

		return {
			...team,
			wins,
			cleanSheets,
			losses,
			ties
		};
	});
}

/**
 * Fetch all players for a given season with their team information
 */
export function fetchSeasonPlayersWithTeams(supabase: SupabaseClient<Database>, season: Season): Promise<SeasonAndTeamPlayer[]> {
	return defer<SeasonAndTeamPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase
				.from('players_seasons')
				.select('*, ...players(*, team:teams_players(...teams(id, color, name, season_id)))')
				.eq('season_id', season.id),
			'Error fetching players'
		);

		if (!players) {
			return [];
		}

		return players.map((ps): SeasonAndTeamPlayer => {
			const seasonTeam = ps.team.find((t) => t.season_id === ps.season_id);

			if (!seasonTeam) {
				throw new Error(`No team found for player ${ps.name} in season ${ps.season_id}`);
			}

			return {
				id: ps.id,
				name: ps.name,
				image: ps.image,
				inform_image: ps.inform_image,
				outofform_image: ps.outofform_image,
				attack: ps.attack,
				defence: ps.defence,
				physical: ps.physical,
				skill: ps.skill,
				morale: ps.morale,
				price: ps.price,
				team: {
					id: seasonTeam.id,
					name: seasonTeam.name,
					color: seasonTeam.color
				},
				season_id: ps.season_id
			};
		});
	});
}

/**
 * Fetch a player for all seasons with their team information
 */
export function fetchAllSeasonsPlayerWithTeam(supabase: SupabaseClient<Database>, playerId: number): Promise<SeasonAndTeamPlayer[]> {
	return defer<SeasonAndTeamPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*, team:teams_players(...teams(*)))').eq('player_id', playerId),
			'Error fetching player'
		);

		if (!players) {
			return [];
		}

		return players.map((ps): SeasonAndTeamPlayer => {
			const team = ps.team.find((t) => t.season_id === ps.season_id);

			return {
				id: ps.id,
				name: ps.name,
				image: ps.image,
				inform_image: ps.inform_image,
				outofform_image: ps.outofform_image,
				attack: ps.attack,
				defence: ps.defence,
				physical: ps.physical,
				skill: ps.skill,
				morale: ps.morale,
				price: ps.price,
				team: team
					? {
							id: team.id,
							name: team.name,
							color: team.color
						}
					: null,
				season_id: ps.season_id
			};
		});
	});
}

/**
 * Fetch all players every season with their team information
 */
export function fetchAllSeasonsPlayersWithTeam(supabase: SupabaseClient<Database>): Promise<SeasonAndTeamPlayer[]> {
	return defer<SeasonAndTeamPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*, team:teams_players(...teams(*)))'),
			'Error fetching player'
		);

		if (!players) {
			return [];
		}

		return players.map((ps): SeasonAndTeamPlayer => {
			const team = ps.team.find((t) => t.season_id === ps.season_id);

			return {
				id: ps.id,
				name: ps.name,
				image: ps.image,
				inform_image: ps.inform_image,
				outofform_image: ps.outofform_image,
				attack: ps.attack,
				defence: ps.defence,
				physical: ps.physical,
				skill: ps.skill,
				morale: ps.morale,
				price: ps.price,
				team: team
					? {
							id: team.id,
							name: team.name,
							color: team.color
						}
					: null,
				season_id: ps.season_id
			};
		});
	});
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
          player:players(*)
        )
      `
				)
				.eq('season_id', Number(seasonId))
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
				clutch_player_id: clutch.player.id
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
			playersIds: team.teams_players.map((tp) => tp.player_id)
		}));

		return teams;
	});
}

export function fetchSeasonStatistics(supabase: SupabaseClient<Database>, season: Season) {
	return defer(async () => {
		const [allPlayers, goalsData, clutchesData, matches, teams] = await Promise.all([
			supabaseQuery(
				supabase.from('players').select('id, name, image, players_seasons!inner(*)').eq('players_seasons.season_id', season.id),
				'Error fetching players'
			),
			supabaseQuery(
				supabase.from('goals').select('goal_player_id, assist_player_id, matches!inner(season_id)').eq('matches.season_id', season.id),
				'Error fetching goals'
			),
			supabaseQuery(
				supabase.from('clutches').select('player_id, matches!inner(season_id)').eq('matches.season_id', season.id),
				'Error fetching clutches'
			),
			supabaseQuery(
				supabase
					.from('matches')
					.select(
						`
						*,
						home_team:teams!team_home_id (
								teams_players(player_id)
						),
						away_team:teams!team_away_id (
								teams_players(player_id)
						),
						goals(*)
					`
					)
					.eq('season_id', season.id),
				'Error fetching matches'
			),
			supabaseQuery(
				supabase
					.from('teams')
					.select(
						`
						*,
						teams_players(player_id)
					`
					)
					.eq('season_id', season.id),
				'Error fetching teams'
			)
		]);

		const cleanedPlayerStats: SeasonPlayerStats[] =
			allPlayers?.map((player) => {
				const goals = goalsData?.filter((g) => g.goal_player_id === player.id).length || 0;
				const assists = goalsData?.filter((g) => g.assist_player_id === player.id).length || 0;
				const clutches = clutchesData?.filter((c) => c.player_id === player.id).length || 0;

				const playerSeasonData = player.players_seasons.find((ps) => ps.season_id === season.id);

				if (!playerSeasonData) {
					throw new Error(`No season data found for player ${player.id} in season ${season.id}`);
				}

				return {
					...player,
					...playerSeasonData,
					id: player.id,
					name: player.name,
					image: player.image,
					season_id: season.id,
					goals,
					assists,
					clutches
				};
			}) || [];

		const cleanedMatches = processMatches(matches);
		const cleanedTeams = processTeams(teams);
		const teamStats = calculateTeamStatistics(cleanedTeams, cleanedMatches);
		const fullPlayerStats = calculateFullPlayerStats(cleanedPlayerStats, teamStats, season);

		return { fullPlayerStats, teamStats };
	});
}

export function fetchPlayerStatistics(supabase: SupabaseClient<Database>, playerId: number) {
	return defer(async () => {
		// First, get the seasons where this player participated
		const playerSeasonsData = await supabaseQuery(
			supabase.from('players_seasons').select('season_id').eq('player_id', playerId),
			'Error fetching player seasons'
		);

		if (!playerSeasonsData || playerSeasonsData.length === 0) {
			return { fullPlayerStats: [], teamStats: [] };
		}

		const seasonIds = playerSeasonsData.map((ps) => ps.season_id);

		// Fetch all data for all seasons the player participated in
		const [allPlayers, goalsData, clutchesData, matches, teams, seasonsData] = await Promise.all([
			supabaseQuery(
				supabase.from('players').select('id, name, image, players_seasons!inner(*)').in('players_seasons.season_id', seasonIds),
				'Error fetching players'
			),
			supabaseQuery(
				supabase.from('goals').select('goal_player_id, assist_player_id, matches!inner(season_id)').in('matches.season_id', seasonIds),
				'Error fetching goals'
			),
			supabaseQuery(
				supabase.from('clutches').select('player_id, matches!inner(season_id)').in('matches.season_id', seasonIds),
				'Error fetching clutches'
			),
			supabaseQuery(
				supabase
					.from('matches')
					.select(
						`
						*,
						home_team:teams!team_home_id (
								teams_players(player_id)
						),
						away_team:teams!team_away_id (
								teams_players(player_id)
						),
						goals(*)
					`
					)
					.in('season_id', seasonIds),
				'Error fetching matches'
			),
			supabaseQuery(
				supabase
					.from('teams')
					.select(
						`
						*,
						teams_players(player_id)
					`
					)
					.in('season_id', seasonIds),
				'Error fetching teams'
			),
			supabaseQuery(
				supabase.from('seasons').select('*').in('id', seasonIds).order('start_time', { ascending: false }),
				'Error fetching seasons'
			)
		]);

		if (
			!seasonsData ||
			seasonsData.length === 0 ||
			!allPlayers ||
			allPlayers.length === 0 ||
			!matches ||
			matches.length === 0 ||
			!teams ||
			teams.length === 0 ||
			!goalsData ||
			!clutchesData
		) {
			return { fullPlayerStats: [], teamStats: [] };
		}

		const seasons = seasonsData?.map((s) => ({
			...s,
			start_time: new Date(s.start_time),
			end_time: new Date(s.end_time),
			deadline_time: new Date(s.deadline_time)
		}));

		const allFullPlayerStats: SeasonPlayerFullStats[] = [];
		const allTeamStats: TeamStatistics[] = [];

		// Process each season
		const result = seasons.map((season) => {
			const seasonId = season.id;

			const seasonGoalsData = goalsData?.filter((g) => g.matches?.season_id === seasonId) || [];
			const seasonClutchesData = clutchesData?.filter((c) => c.matches?.season_id === seasonId) || [];
			const seasonMatches = matches?.filter((m) => m.season_id === seasonId) || [];
			const seasonTeams = teams?.filter((t) => t.season_id === seasonId) || [];

			// Get only the specific player's data
			const player = allPlayers.find((p) => p.id === playerId);
			if (!player) return;

			const goals = seasonGoalsData.filter((g) => g.goal_player_id === playerId).length || 0;
			const assists = seasonGoalsData.filter((g) => g.assist_player_id === playerId).length || 0;
			const clutches = seasonClutchesData.filter((c) => c.player_id === playerId).length || 0;

			const playerSeasonData = player.players_seasons.find((ps) => ps.season_id === seasonId);

			if (!playerSeasonData) {
				return;
			}

			const cleanedPlayerStats: SeasonPlayerStats = {
				...player,
				...playerSeasonData,
				id: player.id,
				name: player.name,
				image: player.image,
				season_id: seasonId,
				goals,
				assists,
				clutches
			};

			const cleanedMatches = processMatches(seasonMatches);
			const cleanedTeams = processTeams(seasonTeams);
			const teamStats = calculateTeamStatistics(cleanedTeams, cleanedMatches);
			const fullPlayerStats = calculateFullPlayerStats([cleanedPlayerStats], teamStats, season);

			// allFullPlayerStats.push(...fullPlayerStats);
			// allTeamStats.push(...teamStats);

			return { fullPlayerStats };
		});

		return { fullPlayerStats: allFullPlayerStats, teamStats: allTeamStats };
	});
}
