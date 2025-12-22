import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { getSeason } }) => {
	const season = await getSeason();

	if (!season) {
		redirect(307, '/');
	}

	return { season };
}) satisfies LayoutServerLoad;
