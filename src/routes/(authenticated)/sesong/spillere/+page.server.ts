import type { SeasonPlayer } from '$lib/types/player';
import type { PageServerLoad } from './$types';
import { fetchSeasonPlayersWithTeams } from '$lib/queries';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	if (!season) {
		return { players: [] };
	}

	const players: Promise<SeasonPlayer[]> = fetchSeasonPlayersWithTeams(supabase, season);

	return { players };
}) satisfies PageServerLoad;
