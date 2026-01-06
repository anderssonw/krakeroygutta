import { fetchAllMatchesForSeason } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	const matches = await fetchAllMatchesForSeason(supabase, season.id);
	return {
		matches: matches.reverse() // Sort newest first
	};
}) satisfies PageServerLoad;
