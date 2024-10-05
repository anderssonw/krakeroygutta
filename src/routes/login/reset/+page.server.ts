import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const errors: Record<string, string> = {};
		const formData = await request.formData();

		const email = formData.get('email')?.toString();

		if (email) {
			const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: '/login/reset/new' });

			if (error) {
				errors.serverError = error.message;
				return fail(500, { errors });
			}

			throw redirect(303, '/');
		} else {
			errors.missing = 'Email must be supplied';
			return fail(401, { errors });
		}
	}
} satisfies Actions;
