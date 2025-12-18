import { type Season } from '$lib/types/database-helpers';
import type { PageServerLoad } from './$types';
import { fetchAllSeasons } from '$lib/queries';
import type { SeasonPlayerFullStats } from '$lib/types/player';
import { fetchSeasonStatistics } from '$lib/queries';

export type SeasonWithPlayerStatistics = {
	seasonId: Season | null;
	players: SeasonPlayerFullStats[];
};

export const load = (async ({ locals: { supabase, getSeason: season }, url }) => {
	const seasons = await fetchAllSeasons(supabase);

	const seasonIdParam = url.searchParams.get('season');
	let targetSeason: Season | null = null;

	if (seasonIdParam) {
		targetSeason = seasons.find((s) => s.id === parseInt(seasonIdParam)) || null;
	}

	if (!targetSeason) {
		targetSeason = await season();

		if (!targetSeason && seasons.length > 0) {
			targetSeason = seasons[0];
		}
	}

	if (!targetSeason) {
		return {
			seasonWithStatistics: null
		};
	}

	const { fullPlayerStats } = await fetchSeasonStatistics(supabase, targetSeason);

	return {
		season: targetSeason,
		allSeasons: seasons,
		players: fullPlayerStats
	};
}) satisfies PageServerLoad;
