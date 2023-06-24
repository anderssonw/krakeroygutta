import type { Season, Team } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import seasonsJson from '$lib/dummydata/seasons.json';
import teamsJson from '$lib/dummydata/teams.json';

export const load: PageServerLoad<{ season: Season | null; teams: Team[] }> = async (event) => {
    const { session } = await getSupabase(event);

    let season: Season | null = null;
    let teams: Team[] = [];

    if (session) {
        const dbSeasons: Season[] = seasonsJson; // Change with fetch from database

         // Check if there is an active season currently
            // When we create seasons, there should be no overlaps between dates, hence no checks necessary
        const today: Date = new Date();
        dbSeasons.forEach(element => {
            const seasonStart: Date = new Date(element.StartDate);
            const seasonEnd: Date = new Date(element.EndDate);

            // Today is between start and end of the season => ongoing season
            if (today > seasonStart && today < seasonEnd) {
                season = element;

                // Get teams that belong to this season
                const dbTeams: Team[] = teamsJson; // Change with fetch from database
                teams = dbTeams.filter(team => team.SeasonID == element.SeasonID);
            }
        });

        return { season: season, teams: teams }
    }

    return { season: season, teams: teams }
}