import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ url, locals: { supabase } }) => {
		const errors: Record<string, string> = {};

		const redirectTo = `${url.origin}/auth/callback?next=/profile`;

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
			throw redirect(303, data.url);
		}
	}
} satisfies Actions;
