import type { SeasonPlayerFullStats } from '$lib/types/player';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, params }): Promise<{ playerSeasons: SeasonPlayerFullStats[] }> => {
	const playerId = params.id;

	return {
		playerSeasons: []
	};
}) satisfies PageServerLoad;
