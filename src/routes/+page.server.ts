import type { Season, Team } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ season: Season | null; teams: Team[] }> = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);

    let season: Season | null = null;
    let seasonID: number = 0;
    let teams: Team[] = [];

    if (session) {
        const seasonsQuery = await supabaseClient.from('seasons').select();

        // Find active season
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

        const teamsQuery = await supabaseClient.from('teams').select().eq("sid", seasonID);
        if (teamsQuery.data != null) {
            teamsQuery.data.forEach((d: Team) => {
                teams.push(d);
            });
        }

        return { season: season, teams: teams }
    }

    return { season: season, teams: teams }
}