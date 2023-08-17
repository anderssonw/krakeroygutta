import type { FantasyStanding, Team, PlayerPoints } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{
	teams: Team[];
	fantasyTeams: FantasyStanding[];
	playerPoints: PlayerPoints[];
}> = async (event) => {
	const { activeSeason } = await event.parent();
	const { session, supabaseClient } = await getSupabase(event);

	let teams: Team[] = [];
	let fantasyTeams: FantasyStanding[] = [];
	let playerPoints: PlayerPoints[] = [];

	if (session) {
		// Find teams based on the active season
		const teamsQuery = await supabaseClient.from('teams').select('*').eq('season_id', activeSeason?.id);
		if (teamsQuery.data != null) {
			teamsQuery.data.forEach((d: Team) => {
				teams.push(d);
			});
		}

		// Get all fantasy teams for the season
		const fantasyQuery = await supabaseClient.from('fantasy_teams').select('*').eq('sid', activeSeason?.id);
		if (fantasyQuery.data != null) {
			fantasyQuery.data.forEach((d: FantasyStanding) => {
				fantasyTeams.push(d);
			});
		}

		return { teams: teams, fantasyTeams: fantasyTeams, playerPoints: playerPoints };
	}

	return { teams: teams, fantasyTeams: fantasyTeams, playerPoints: playerPoints };
};
