import { fail, type Actions, redirect } from '@sveltejs/kit';
import { passwordErrors } from '$lib/profile/password';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const errors: Record<string, string> = {};
		const formData = await request.formData();

		const password = formData.get('password')?.toString();
		const errorsInPassword = passwordErrors(password);

		if (Object.entries(errorsInPassword).length > 0) {
			return fail(401, { errorsInPassword });
		}

		if (password) {
			const { data, error } = await supabase.auth.updateUser({
				password: password
			});

			if (error) {
				errors.serverError = error.message;
				return fail(500, { errors });
			}
		}
	}
} satisfies Actions;
