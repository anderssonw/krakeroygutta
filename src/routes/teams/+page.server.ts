import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const { data: teams, error: teamError } = await supabase.from('teams').select().eq('season_id', season.id);
		if (teamError) {
			throw error(500, {
				message: teamError.message
			});
		}

		return { teams: teams, players: [] };
	}

	return { teams: [], players: [] };
};
