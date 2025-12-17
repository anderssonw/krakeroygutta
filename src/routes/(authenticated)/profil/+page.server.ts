import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchAllSeasonsPlayerWithTeam, fetchAllSeasons } from '$lib/queries.js';
import { defer } from '$lib/supabaseClient';

export const load = (async ({ parent, locals: { supabase } }) => {
	const { profile, season } = await parent();

	if (!profile) {
		throw redirect(303, '/login');
	}

	const seasons = defer(() => fetchAllSeasons(supabase));

	if (!profile.player_id) {
		return {
			playerSeasons: null,
			currentSeason: season,
			seasons
		};
	}

	return {
		playerSeasons: defer(() => fetchAllSeasonsPlayerWithTeam(supabase, profile.player_id!)), // Non-null assertion since we check for player_id above
		currentSeason: season,
		seasons
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
	}
};
