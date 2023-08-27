import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals: { supabase } }) => {
		const errors: Record<string, string> = {};
		const { error } = await supabase.auth.signOut();

		if (error) {
			errors.signOutError = error.message;
			return fail(500, { errors });
		}
	}
} satisfies Actions;