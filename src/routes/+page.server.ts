import type { Fantasy, FantasyStanding, Season, Team, UserDB } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ season: Season | null; teams: Team[], fantasyTeams: FantasyStanding[] }> = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);

    let season: Season | null = null;
    let seasonID: number = 0;
    let teams: Team[] = [];
    let fantasyTeams: FantasyStanding[] = [];

    if (session) {
        // Find active season
        const seasonsQuery = await supabaseClient.from('seasons').select();
        const today: Date = new Date();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.every((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);

                // Today is between start and end of the season => ongoing season
                if (today > seasonStart && today < seasonEnd) {
                    season = d;
                    seasonID = season.sid;
                    
                    // Break out
                    return false;
                }

                // Continue iterating
                return true;
            });
        }

        // Find teams based on the active season
        const teamsQuery = await supabaseClient.from('teams').select().eq("sid", seasonID);
        if (teamsQuery.data != null) {
            teamsQuery.data.forEach((d: Team) => {
                teams.push(d);
            });
        }




        // Find users and fantasy score
        let listOfFantasyTeams: any[] = []
        const fantasyQuery =  await supabaseClient.from('fantasy').select().eq("sid", seasonID);
        if (fantasyQuery.data != null) {
            fantasyQuery.data.forEach((d: Fantasy) => {
                let fantasyTeam: any = {
                    uid: d.uid,
                    players: d.players
                }
                listOfFantasyTeams.push(fantasyTeam);
            });
        }
        // Replace uid with username
        const userQuery =  await supabaseClient.from('users').select();
        let users: UserDB[] = [];
        if (userQuery.data != null) {
            userQuery.data.forEach((d: UserDB) => {
                users.push(d);
            });
        }
        listOfFantasyTeams.forEach((team: any) => {
            const foundUser = users.find(user => user.uid == team.uid);
            if (foundUser){
                let fantasyTeam: FantasyStanding = {
                    username: foundUser.username,
                    players: team.players
                }
                fantasyTeams.push(fantasyTeam);
            }
        })


        return { season: season, teams: teams, fantasyTeams: fantasyTeams }
    }

    return { season: season, teams: teams, fantasyTeams: fantasyTeams }
}