import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MatchStatsQuery } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();
	if (session) {
		if (!season) return {};

		const { data: matchesStats, error: matchesStatsError } = await supabase
			.from('imp_view')
			.select(
				`
					*
				`
			)

		if (matchesStatsError) {
			throw error(500, {
				message: matchesStatsError.message
				// devHelper: '/fantasy getting players with stats'
			});
		}

		return {
			matchesStats
		};
	}

	return {};
};
