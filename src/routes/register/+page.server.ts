import type { AuthError } from '@supabase/supabase-js';
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
			const { data, error: error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						nickname
					}
				}
			});

			let authError = null;

			// User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
			if (data.user && data.user.identities && data.user.identities.length === 0) {
				authError = {
					name: 'AuthApiError',
					message: 'User already exists'
				};
			} else if (error) {
				authError = {
					name: error.name,
					message: error.message
				};
			}

			if (authError != null) {
				let msg = authError.message;

				return fail(500, {
					message: msg,
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
