import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';
import type { FullPlayer, MatchStatsTeam } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, params }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getPlayersForSeason = async (player_id: number, supabase: SupabaseClient<Database>) => {
			const { data: player, error: playerError } = await supabase
				.from('player_season_stats')
				.select(
					`   
						*
					`
				)
				.eq('player_id', player_id)
				.returns<FullPlayer[]>();

			if (playerError) {
				throw error(500, {
					message: playerError.message,
					devHelper: 'players/[slug] fetch player with stats'
				});
			}

			return player;
		}

		const getMatchesForSeason = async (supabase: SupabaseClient<Database>) => {
			const { data: matches, error: matchesError } = await supabase
				.from('matches')
				.select(
					`
						*
					`
				)
				.returns<Tables<'matches'>[]>();
			
			if (matchesError) {
				throw error(500, {
					message: matchesError.message,
					devHelper: '/matches getting matches'
				});
			}
		
			return matches;
		};

		const getTeamStatsSeason = async (supabase: SupabaseClient<Database>) => {
			const { data: teamStats, error: teamStatsError } = await supabase
				.from('team_with_stats')
				.select(
					`
						*
					`
				)
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
			playerVersions: getPlayersForSeason(parseInt(params.slug), supabase),
			allMatches: getMatchesForSeason(supabase),
			teamStats: getTeamStatsSeason(supabase)
		}

	}
	return {};
};
