import type { Tables } from '$lib/types/database.helper.types.js';

export const load = async ({ parent }) => {
	const { supabase, session } = await parent();

	let teams: Tables<'teams'>[] = [];
	let fantasyTeams: Tables<'fantasy_team'>[] = [];

	if (session) {
		// Find teams based on the active season
		const teamsQuery = await supabase.from('teams').select('*').eq('season_id', 2);
		if (teamsQuery.data != null) {
			teamsQuery.data.forEach((team: Tables<'teams'>) => {
				teams.push(team);
			});
		}

		// Get all fantasy teams for the season
		const fantasyQuery = await supabase.from('fantasy_team').select('*').eq('season_id', 2);
		if (fantasyQuery.data != null) {
			fantasyQuery.data.forEach((fantasyTeam: Tables<'fantasy_team'>) => {
				fantasyTeams.push(fantasyTeam);
			});
		}

		return { teams: teams, fantasyTeams: fantasyTeams };
	}

	return { teams: teams, fantasyTeams: fantasyTeams };
};
