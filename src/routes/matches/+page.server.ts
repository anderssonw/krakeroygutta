import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();
	if (session) {
		if (!season) return {};

		const { data: matches, error: matchesError } = await supabase
			.from('matches')
			.select(
				`
					*,
					goals(player_id),
					assists(player_id),
					clutches(player_id)
				`
			)
			.eq('season_id', season.id);

		if (matchesError) {
			throw fail(500, {
				message: matchesError.message
			});
		}

		const { data: teams, error: teamsError } = await supabase
			.from('teams')
			.select(
				`
					*,
					teams_players(
						players(id, name)
					)
				`
			)

		if (teamsError) {
			throw fail(500, {
				message: teamsError.message
			});
		}

		return {
			matches,
			teams
		};
	}

	return {};
};
