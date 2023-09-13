import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MatchStatsQuery } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();
	if (session) {
		if (!season) return {};

		const { data: matchesStats, error: matchesStatsError } = await supabase
			.from('matchstats_view')
			.select(
				`
					*
				`
			)
			.eq('season_id', season.id)
			.returns<MatchStatsQuery[]>();

		if (matchesStatsError) {
			throw error(500, {
				message: matchesStatsError.message,
				devHelper: '/matches getting match statistics'
			});
		}

		return {
			matchesStats
		};
	}

	return {};
};
