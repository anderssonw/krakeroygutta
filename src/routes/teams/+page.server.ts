import type { PageServerLoad } from './$types';
import type { Team, Player } from '$lib/types/newTypes';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ teams: Team[]; players: Player[] }> = async (event) => {
    let teams: Team[] = [];
    let players: Player[] = [];

    // Get all players
    const { supabaseClient } = await getSupabase(event);

    // Teams
    const teamsQuery = await supabaseClient.from('teams').select();
    if (teamsQuery.data != null) {
		teamsQuery.data.forEach((d: Team) =>
        teams.push(d)
		);
	}

    // Players ---> TODO: Merge with teams, get each player with info for each team
    const playersQuery = await supabaseClient.from('players').select();
    if (playersQuery.data != null) {
		playersQuery.data.forEach((d: Player) =>
			players.push(d)
		);
	}

    return { teams: teams, players: players }

}