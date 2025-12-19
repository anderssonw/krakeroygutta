import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { getSeason } }) => {
	const season = await getSeason();

	if (!season) {
		// TODO Vil garantere at det er en sesong her på noe vis. GetSeson bør kanskje bare håndtere det
		error(404, 'Season not found');
	}

	return { season };
}) satisfies LayoutServerLoad;
