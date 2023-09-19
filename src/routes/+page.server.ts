import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './admin/$types';
import type { Database } from '$lib/types/database.generated.types';
import type { MatchStatsQuery } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		return {
			season,
			teams: getTeamsForSeason(season.id, supabase),
			matches: getMatchesForSeason(season.id, supabase),
			lazy: {
				fantasyTeams: getFantasyTeamsForSeason(season.id, supabase)
			}
		};
	}

	return {};
};

const getTeamsForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
	const { data } = await supabase
		.from('teams')
		.select(
			`
				*,
				teams_players(player_id)
			`
		)
		.eq('season_id', season_id);

	return data || [];
};

const getFantasyTeamsForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
	const { data } = await supabase
		.from('fantasy_teams')
		.select(
			`
					*,
					fantasy_teams_players(player_id)
				`
		)
		.eq('season_id', season_id);

	return data || [];
};

const getMatchesForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
	const { data } = await supabase
		.from('matchstats_view')
		.select(
			`
					*
				`
		)
		.eq('season_id', season_id)
		.returns<MatchStatsQuery[]>();

	return data || [];
};
