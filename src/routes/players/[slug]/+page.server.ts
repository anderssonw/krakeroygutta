import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';
import type { FullPlayer } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, params }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getPlayerForSeason = async (season_id: number, player_id: number, supabase: SupabaseClient<Database>) => {
			const { data: player, error: playerError } = await supabase
				.from('player_season_stats')
				.select(
					`   
						*
					`
				)
				.eq('season_id', season_id)
				.eq('player_id', player_id)
				.returns<FullPlayer[]>()
				.single();

			if (playerError) {
				throw error(500, {
					message: playerError.message,
					devHelper: 'players/[slug] fetch player with stats'
				});
			}

			return player;
		}

		

		return { player: getPlayerForSeason(season.id, parseInt(params.slug), supabase) }

	}
	return {};
};
