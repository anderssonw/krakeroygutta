import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

	const { data: players, error: playersError } = await supabase.from('players').select();

	if (playersError) {
		// TODO
	}

	const { data: playersSeasons, error: playersSeasonsError } = await supabase.from('players_seasons').select().eq('season_id', season?.id);

	if (playersSeasonsError) {
		// TODO
	}

	return { players, playersSeasons };
};
