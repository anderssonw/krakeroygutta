import { fetchAllSeasons, fetchPlayerStatisticsAllSeasons } from '$lib/queries';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, params, parent }) => {
	const playerId = params.id;

	const { season } = await parent();

	return {
		playerSeasons: fetchPlayerStatisticsAllSeasons(supabase, parseInt(playerId)),
		seasons: fetchAllSeasons(supabase),
		currentSeason: season
	};
}) satisfies PageServerLoad;
