import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { profile } = await parent();

	if (!profile) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
	}
};
