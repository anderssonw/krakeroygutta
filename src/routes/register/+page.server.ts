import { fail, type Actions, redirect, error } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const nickname = formData.get('nickname')?.toString();

		let formHints: string[] = [];

		if (!email || email === '') {
			formHints.push('Email may not be empty');
		}

		let passwordIsGood = false;

		if (!password || password === '') {
			formHints.push('Password may not be empty');
		} else if (password.length < 8) {
			formHints.push('Password must be at least 8 characters');
		} else {
			passwordIsGood = true;
		}

		if (!nickname || nickname === '') {
			formHints.push('Nickname may not be empty');
		}

		if (email && password && passwordIsGood && nickname) {
			const { error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						nickname
					}
				}
			});

			if (authError) {
				console.log(authError);
				throw error(500, {
					message: authError.message,
					devHelper: '/register'
				});
			}

			throw redirect(303, '/');
		}

		return fail(400, {
			formHints
		});
	}
} satisfies Actions;
