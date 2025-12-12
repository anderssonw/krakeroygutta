import { type Season } from '$lib/types/database-helpers';
import { defer, supabaseQuery } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export type FullPlayerStats = {
	id: number;
	name: string;
	image: string | null;
	goals: number;
	assists: number;
	clutches: number;
	cleanSheets: number;
	victories: number;
	totalScore: number;
};

type PlayerStats = Omit<FullPlayerStats, 'cleanSheets' | 'victories' | 'fantasyTeamPicks' | 'totalScore'>;

type TeamStats = {
	players: number[];
	wins: number;
	cleanSheets: number;
};

export type SeasonWithPlayerStatistics = {
	seasonId: Season | null;
	players: FullPlayerStats[];
};

export const load = (async ({ locals: { supabase, getSeason: season }, url }) => {
	// First, get all seasons to determine target season
	const allSeasons = await supabaseQuery(
		supabase.from('seasons').select('*').order('start_time', { ascending: false }),
		'Error fetching seasons'
	);

	const seasonsWithDates: Season[] =
		allSeasons?.map((row) => {
			return {
				...row,
				deadline_time: new Date(row.deadline_time),
				end_time: new Date(row.end_time),
				start_time: new Date(row.start_time)
			};
		}) || [];

	const seasonIdParam = url.searchParams.get('season');
	let targetSeason: Season | null = null;

	if (seasonIdParam) {
		targetSeason = seasonsWithDates.find((s) => s.id === parseInt(seasonIdParam)) || null;
	}

	if (!targetSeason) {
		targetSeason = await season();

		if (!targetSeason && seasonsWithDates.length > 0) {
			targetSeason = seasonsWithDates[0];
		}
	}

	if (!targetSeason) {
		return {
			seasonWithStatistics: null
		};
	}

	const targetSeasonId = targetSeason.id;

	const deferredPlayers = defer(async () => {
		const [allPlayers, goalsData, clutchesData, matches, teams] = await Promise.all([
			supabaseQuery(
				supabase
					.from('players')
					.select('id, name, image, players_seasons!inner(season_id)')
					.eq('players_seasons.season_id', targetSeasonId),
				'Error fetching players'
			),
			supabaseQuery(
				supabase.from('goals').select('goal_player_id, assist_player_id, matches!inner(season_id)').eq('matches.season_id', targetSeasonId),
				'Error fetching goals'
			),
			supabaseQuery(
				supabase.from('clutches').select('player_id, matches!inner(season_id)').eq('matches.season_id', targetSeasonId),
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
					.eq('season_id', targetSeasonId),
				'Error fetching matches'
			),
			supabaseQuery(
				supabase
					.from('teams')
					.select(
						`
						id,
						teams_players(player_id)
					`
					)
					.eq('season_id', targetSeasonId),
				'Error fetching teams'
			)
		]);

		// Aggregate stats per player
		const cleanedPlayerStats: PlayerStats[] =
			allPlayers?.map((player) => {
				const goals = goalsData?.filter((g) => g.goal_player_id === player.id).length || 0;
				const assists = goalsData?.filter((g) => g.assist_player_id === player.id).length || 0;
				const clutches = clutchesData?.filter((c) => c.player_id === player.id).length || 0;

				return {
					id: player.id,
					name: player.name,
					image: player.image,
					goals,
					assists,
					clutches
				};
			}) || [];

		const cleanedMatches =
			matches?.map((match) => {
				const homeTeamPlayers = match.home_team?.teams_players?.map((tp) => tp.player_id) || [];
				const awayTeamPlayers = match.away_team?.teams_players?.map((tp) => tp.player_id) || [];

				return {
					id: match.id,
					homeTeam: {
						id: match.team_home_id,
						players: homeTeamPlayers,
						goals: match.goals?.filter((g) => homeTeamPlayers.includes(g.goal_player_id)).length
					},
					awayTeam: {
						id: match.team_away_id,
						players: awayTeamPlayers,
						goals: match.goals?.filter((g) => awayTeamPlayers.includes(g.goal_player_id)).length
					}
				};
			}) || [];

		const cleanedTeams =
			teams?.map((team) => ({
				id: team.id,
				players: team.teams_players?.map((tp) => tp.player_id) || []
			})) || [];

		const teamStats: TeamStats[] = cleanedTeams.map((team) => {
			let wins = 0;
			let cleanSheets = 0;

			cleanedMatches.forEach((match) => {
				const isHomeTeam = match.homeTeam.id === team.id;
				const isAwayTeam = match.awayTeam.id === team.id;

				if (isHomeTeam || isAwayTeam) {
					const teamGoals = isHomeTeam ? match.homeTeam.goals : match.awayTeam.goals;
					const opponentGoals = isHomeTeam ? match.awayTeam.goals : match.homeTeam.goals;

					if (teamGoals > opponentGoals) {
						wins += 1;
					}

					if (opponentGoals === 0) {
						cleanSheets += 1;
					}
				}
			});

			return {
				players: team.players,
				wins,
				cleanSheets
			};
		});

		const fullPlayerStats: FullPlayerStats[] = cleanedPlayerStats.map((ps) => {
			let victories = 0;
			let cleanSheets = 0;

			teamStats.forEach((ts) => {
				if (ts.players.includes(ps.id)) {
					victories += ts.wins;
					cleanSheets += ts.cleanSheets;
				}
			});

			const { points_per_goal, points_per_assist, points_per_clutch, points_per_win, points_per_clean_sheet } = targetSeason;

			const totalScore =
				ps.goals * points_per_goal +
				ps.assists * points_per_assist +
				ps.clutches * points_per_clutch +
				cleanSheets * points_per_clean_sheet +
				victories * points_per_win;

			return {
				...ps,
				victories,
				cleanSheets,
				totalScore
			};
		});

		return fullPlayerStats;
	});

	return {
		season: targetSeason,
		allSeasons: seasonsWithDates,
		players: deferredPlayers
	};
}) satisfies PageServerLoad;
