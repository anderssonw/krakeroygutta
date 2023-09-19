import { type fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url, parent }) => {
	const { session, user } = await parent();

	const getTeams = async (seasonIdParam: string) => {
		const { data: data, error: teamsError } = await supabase
			.from('teams')
			.select(`*, teams_players(player_id)`)
			.eq('season_id', seasonIdParam);

		if (teamsError) {
			throw error(500, {
				message: teamsError.message,
				devHelper: '/admin/teams getting teams'
			});
		}

		return data;
	};

	const seasonIdParam = url.searchParams.get('season');
	if (!seasonIdParam) return {};

	if (session && user?.is_superadmin) {
		return { teams: getTeams(seasonIdParam), seasonId: seasonIdParam };
	}

	return {};
};

export const actions = {} satisfies Actions;
