import type { FantasyStanding, Team, Player } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ teams: Team[], fantasyTeams: FantasyStanding[], players: Player[] }> = async (event) => {
    const { activeSeason } = await event.parent();
    const { session, supabaseClient } = await getSupabase(event);

    let teams: Team[] = [];
    let fantasyTeams: FantasyStanding[] = [];
    let players: Player[] = [];

    if (session) {
        // Find teams based on the active season
        const teamsQuery = await supabaseClient.from('teams').select().eq("sid", activeSeason?.sid);
        if (teamsQuery.data != null) {
            teamsQuery.data.forEach((d: Team) => {
                teams.push(d);
            });
        }

        // Get all fantasy teams for the season
        const fantasyQuery =  await supabaseClient.from('usersfantasy').select().eq("sid", activeSeason?.sid);
        if (fantasyQuery.data != null) {
            fantasyQuery.data.forEach((d: FantasyStanding) => {
                fantasyTeams.push(d);
            });
        }

        // Get all players
        const playersQuery = await supabaseClient.from('players').select();
        if (playersQuery.data != null) {
            playersQuery.data.forEach((d: Player) => {
                players.push(d);
            })
        }


        return { teams: teams, fantasyTeams: fantasyTeams, players: players }
    }

    return { teams: teams, fantasyTeams: fantasyTeams, players: players }
}