import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer, FullTeam } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';
import type { Database } from '$lib/types/database.generated.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	
	if (session) {
		if (!season) return {};

		const getTeamsForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: teams, error: teamError } = await supabase
				.from('teams')
				.select(
					`
						*
					`
				)
				.eq('season_id', season_id)
				.returns<Tables<'teams'>[]>();

			if (teamError) {
				throw error(500, {
					message: teamError.message,
					devHelper: '/teams fetching teams for a season'
				});
			}

			return teams
		}

		const getPlayerSeasonStats = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: teams, error: teamError } = await supabase
				.from('player_season_stats')
				.select(
					`
						*
					`
				)
				.eq('season_id', season_id)
				.returns<FullPlayer[]>();

			if (teamError) {
				throw error(500, {
					message: teamError.message,
					devHelper: '/teams fetching teams for a season'
				});
			}

			return teams
		}

		return { 
			teams: getTeamsForSeason(season.id, supabase), 
			players: getPlayerSeasonStats(season.id, supabase)
		}
	}
	return {};
	// Map to FullTeam[]
};
