import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer, FullTeam } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const { data: fullTeams, error: fullTeamsError } = await supabase
			.from('teams_with_players')
			.select(
				`
					*
				`
			)
			.eq('season_id', season.id)
			.returns<FullTeam[]>();

		if (fullTeamsError) {
			throw error(500, {
				message: fullTeamsError.message,
				devHelper: '/teams fetching teams for a season'
			});
		}

		return { teams: fullTeams };
	}

	return { teams: [] };
};