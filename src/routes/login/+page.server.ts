import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ url, locals: { supabase } }) => {
		const errors: Record<string, string> = {};

		const redirectTo = `${url.origin}/auth/callback?next=/profil`;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectTo
			}
		});

		if (error) {
			errors.serverError = error.message;
			return fail(500, { errors });
		}

		if (data.url) {
			redirect(303, data.url);
		}
	}
} satisfies Actions;
