import type { SeasonAndTeamPlayer } from '$lib/types/player';
import type { PageServerLoad } from './$types';
import { fetchSeasonPlayersWithTeams } from '$lib/queries';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	if (!season) {
		return { players: [] };
	}

	const players: Promise<SeasonAndTeamPlayer[]> = fetchSeasonPlayersWithTeams(supabase, season);

	return { players };
}) satisfies PageServerLoad;
