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

			return {
				message:
					'Du har nå registert deg. For å logge inn må du aktivere e-posten din. Du skal motta en e-post på den registrerte e-posten om kort tid med instrukser'
			};
		}

		return fail(400, {
			formHints
		});
	}
} satisfies Actions;
