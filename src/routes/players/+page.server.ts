import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';
import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getPlayersForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: players, error: playersError } = await supabase
				.from('player_season_stats')
				.select(
					`   
						*
					`
				)
				.eq('season_id', season_id)
				.overrideTypes<FullPlayer[]>();

			if (playersError) {
				error(500, {
					message: playersError.message,
					devHelper: 'players/[slug] fetch player with stats'
				});
			}

			return players;
		};

		return { players: await getPlayersForSeason(season.id, supabase) };
	}
	return {};
};
