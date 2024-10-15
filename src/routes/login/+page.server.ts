import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const errors: Record<string, string> = {};
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (email && password) {
			const { error } = await supabase.auth.signInWithPassword({ email, password });

			console.log(error);

			if (error) {
				errors.serverError = error.message;
				return fail(500, { errors });
			}

			throw redirect(303, '/');
		} else {
			errors.missing = 'Email and password must be supplied';
			return fail(401, { errors });
		}
	}
} satisfies Actions;
