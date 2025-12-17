import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { profile } = await parent();

	if (!profile.is_admin) {
		console.error('Unauthenticated access to authenticated layout');
		redirect(303, '/login');
	}
};
