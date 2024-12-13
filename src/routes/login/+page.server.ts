import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ url, locals: { supabase } }) => {
		const errors: Record<string, string> = {};

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback?next=/profile`
			}
		});

		if (error) {
			errors.serverError = error.message;
			return fail(500, { errors });
		}

		if (data.url) {
			throw redirect(303, data.url);
		}
	}
} satisfies Actions;
