import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MatchStatsTeam, MatchWithSeasonName } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';
import type { Database } from '$lib/types/database.generated.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getMatchesForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: matches, error: matchesError } = await supabase
				.from('matches')
				.select(
					`
						*,
						season_name:seasons(name)
					`
				)
				.eq('season_id', season_id)
				.returns<MatchWithSeasonName[]>();

			if (matchesError) {
				throw error(500, {
					message: matchesError.message,
					devHelper: '/matches getting matches'
				});
			}

			return matches;
		};

		const getTeamStatsSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: teamStats, error: teamStatsError } = await supabase
				.from('team_with_stats')
				.select(
					`
						*
					`
				)
				.eq('season_id', season_id)
				.returns<MatchStatsTeam[]>();

			if (teamStatsError) {
				throw error(500, {
					message: teamStatsError.message,
					devHelper: '/team_with_stats getting team with player stats - view'
				});
			}

			return teamStats;
		};

		return {
			matches: getMatchesForSeason(season.id, supabase),
			teamStats: getTeamStatsSeason(season.id, supabase)
		};
	}

	return {};
};
