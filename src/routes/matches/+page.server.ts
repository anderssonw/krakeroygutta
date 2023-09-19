import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MatchStatsTeam } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

	const fetchMatches = async () => {
		const { data: matches, error: matchesError } = await supabase
			.from('matches')
			.select(
				`
					*
				`
			)
			.eq('season_id', season?.id)
			.returns<Tables<'matches'>[]>();

		if (matchesError) {
			throw error(500, {
				message: matchesError.message,
				devHelper: '/matches getting matches'
			});
		}

		return matches;
	}

	const fetchTeamStats = async () => {
		const { data: teamStats, error: teamStatsError } = await supabase
			.from('team_with_stats')
			.select(
				`
					*
				`
			)
			.eq('season_id', season?.id)
			.returns<MatchStatsTeam[]>();

		if (teamStatsError) {
			throw error(500, {
				message: teamStatsError.message,
				devHelper: '/matches getting matches'
			});
		}

		return teamStats;
	}

	return { matches: fetchMatches(), teamStats: fetchTeamStats() };
};
