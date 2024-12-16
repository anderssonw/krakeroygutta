import { fail, type Actions, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';

export const load: PageServerLoad = async ({ locals: { supabase, getGuttaUser } }) => {
	let user = await getGuttaUser();

	if (user) {
		const getPlayer = async (player_id: number, supabase: SupabaseClient<Database>) => {
			if (player_id == -1) return null;
			const { data: player, error: playerError } = await supabase.from('players').select().eq('id', player_id).single();

			if (playerError) {
				throw error(500, {
					message: playerError.message,
					devHelper: '/profile get player'
				});
			}

			return player;
		};

		return {
			player: await getPlayer(user.player_id || -1, supabase)
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
