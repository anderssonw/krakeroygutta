import type { Player, Season, Team } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ allSeasons: Season[]; allPlayers: Player[]; allTeams: Team[]; }> = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);

    let allSeasons: Season[] = []
    let allPlayers: Player[] = []
    let allTeams: Team[] = []

    if (session) {
        const seasonsQuery = await supabaseClient.from('seasons').select();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                allSeasons.push(d);
            });
        }

        
        const playersQuery = await supabaseClient.from('players').select();
        if (playersQuery.data != null) {
            playersQuery.data.forEach((d: Player) => {
                allPlayers.push(d);
            });
        }
        
        const teamsQuery = await supabaseClient.from('teams').select();
        if (teamsQuery.data != null) {
            teamsQuery.data.forEach((d: Team) => {
                allTeams.push(d);
            });
        }

        return { allSeasons: allSeasons, allPlayers: allPlayers, allTeams: allTeams }
    }

    return { allSeasons: allSeasons, allPlayers: allPlayers, allTeams: allTeams }
}