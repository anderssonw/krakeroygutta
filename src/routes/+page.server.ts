import type { PageServerLoad } from './admin/$types';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const { data: teams, error: teamError } = await supabase
			.from('teams')
			.select(
				`
				*,
				teams_players(player_id)
				`
			)
			.eq('season_id', season.id);

		if (teamError) {
			throw error(500, {
				message: teamError.message
			});
		}

		const { data: fantasyTeams, error: fantasyTeamsError } = await supabase
			.from('fantasy_teams')
			.select(
				`
					*,
					fantasy_teams_players(player_id)
				`
			)
			.eq('season_id', season.id);

		if (fantasyTeamsError) {
			throw error(500, {
				message: fantasyTeamsError.message
			});
		}

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
			throw error(500, {
				message: matchesError.message
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
