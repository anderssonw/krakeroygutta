import type { PageServerLoad } from './admin/$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();
	if (session) {
		if (!season) return {};

		const { data: teams, error: teamError } = await supabase.from('teams').select().eq('season_id', season.id);

		if (teamError) {
			return fail(500, {
				supabaseErrorMessage: teamError.message
			});
		}

		const { data: fantasyTeams, error: fantasyTeamsError } = await supabase.from('fantasy_teams').select().eq('season_id', season.id);

		if (fantasyTeamsError) {
			return fail(500, {
				supabaseErrorMessage: fantasyTeamsError.message
			});
		}

		const { data: matches, error: matchesError } = await supabase.from('matches').select().eq('season_id', season.id);

		if (matchesError) {
			return fail(500, {
				supabaseErrorMessage: matchesError.message
			});
		}

		return {
			season,
			teams,
			fantasyTeams,
			matches
		};
	}

	return {};
};
