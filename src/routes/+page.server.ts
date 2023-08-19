import type { PageServerLoad } from './admin/$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, getSession }, params, cookies }) => {
	if (await getSession()) {
		let todayTimeString = new Date().toDateString();

		const { data: season, error: seasonError } = await supabase
			.from('seasons')
			.select()
			.lt('start_time', todayTimeString)
			.gt('end_time', todayTimeString)
			.single();

		if (seasonError) {
			return fail(500, {
				supabaseErrorMessage: seasonError.message
			});
		}

		const { data: teams, error: teamError } = await supabase.from('teams').select().eq('season_id', season.id);

		if (teamError) {
			return fail(500, {
				supabaseErrorMessage: teamError.message
			});
		}

		const { data: fantasyTeams, error: fantasyTeamsError } = await supabase.from('fantasy_team').select().eq('season_id', season.id);

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
