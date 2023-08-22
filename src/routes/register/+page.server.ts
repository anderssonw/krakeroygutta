import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (email && password) {
			const { error: error } = await supabase.auth.signUp({
				email,
				password
			});

			if (error) {
				return fail(500, {
					supabaseErrorMessage: error.message
				});
			}
		}

		return fail(400);
	}
} satisfies Actions;