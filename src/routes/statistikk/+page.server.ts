import { tableSeasonRowToSeason, type Season } from '$lib/types/database-helpers';
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
	fantasyTeamPicks: number;
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

export const load = (async ({ locals: { supabase, season }, url }) => {
	// Fetch all available seasons for dropdown
	const { data: allSeasons } = await supabase.from('seasons').select('*').order('start_time', { ascending: false });

	const seasonsWithDates: Season[] = allSeasons?.map(tableSeasonRowToSeason) || [];

	// Get season ID from query parameter or fallback to current season
	const seasonIdParam = url.searchParams.get('season');
	let targetSeason: Season | null = null;

	if (seasonIdParam) {
		// Find season from already fetched seasons
		targetSeason = seasonsWithDates.find((s) => s.id === parseInt(seasonIdParam)) || null;
	}

	// Fallback to current season if no parameter or season not found
	if (!targetSeason) {
		targetSeason = await season();
		// If still no season, use the newest one
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

	const { data: playerStats, error } = await supabase
		.from('players')
		.select(
			`
      *,
      goals:goals!goal_player_id (count),
      assists:goals!assist_player_id (count),
      clutches!player_id (count)
    `
		)
		.eq('season_id', targetSeasonId);

	const cleanedPlayerStats: PlayerStats[] =
		playerStats?.map((ps) => ({
			...ps,
			goals: ps.goals?.length || 0,
			assists: ps.assists?.length || 0,
			clutches: ps.clutches?.length || 0
		})) || [];

	const { data: matches } = await supabase
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

		.eq('season_id', targetSeasonId);
}) satisfies PageServerLoad;
