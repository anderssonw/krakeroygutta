import { fail, type Actions, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';

export const load: PageServerLoad = async ({ locals: { supabase, getGuttaUser } }) => {
	let user = await getGuttaUser();

	if (user) {
		const getPlayer = async () => {
			const playerId = user.player_id;

			if (!playerId) return null;

			const { data: player, error: playerError } = await supabase
				.from('players')
				.select('*, players_seasons(*)')
				.eq('id', playerId)
				.single();

			if (playerError) {
				throw error(500, {
					message: `Noe gikk galt: ${playerError.message}`,
					devHelper: '/profile get player'
				});
			}

			return player;
		};

		const getSeasons = async () => {
			const { data: seasons, error: seasonsError } = await supabase.from('seasons').select();

			if (seasonsError) {
				throw error(500, {
					message: `Noe gikk galt: ${seasonsError.message}`,
					devHelper: '/profile get player'
				});
			}

			return seasons;
		};

		return {
			player: await getPlayer(),
			seasons: await getSeasons()
		};
	}
	return {};
};

export const actions = {
	default: async ({ locals: { supabase } }) => {
		const errors: Record<string, string> = {};
		const { error } = await supabase.auth.signOut();

		if (error) {
			errors.signOutError = error.message;
			return fail(500, { errors });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
