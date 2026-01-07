import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchAllSeasons, fetchPlayerStatisticsAllSeasons } from '$lib/queries.js';

export const load = (async ({ parent, locals: { supabase } }) => {
	const { profile, season } = await parent();

	if (!profile) {
		throw redirect(303, '/login');
	}

	// Return promises directly for streaming
	if (!profile.player_id) {
		return {
			playerSeasons: null,
			currentSeason: season,
			seasons: fetchAllSeasons(supabase)
		};
	}

	return {
		playerSeasons: fetchPlayerStatisticsAllSeasons(supabase, profile.player_id),
		currentSeason: season,
		seasons: fetchAllSeasons(supabase)
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
	}
};
