import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { session, profile, season, cookies } = await parent();

	if (!profile || !session) {
		console.error('Unauthenticated access to authenticated layout');
		redirect(303, '/login');
	}

	return {
		session,
		profile,
		season,
		cookies
	};
};
