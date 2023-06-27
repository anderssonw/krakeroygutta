import type { Season, Team } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ activeSeason: Season | null; allSeasons: Season[]; }> = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);

    let activeSeason: Season | null = null;
    let allSeasons: Season[] = []

    if (session) {
        const seasonsQuery = await supabaseClient.from('seasons').select();

        // Find active season
        const today: Date = new Date();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);

                // Today is between start and end of the season => ongoing season
                if (today > seasonStart && today < seasonEnd) {
                    activeSeason = d;
                }

                allSeasons.push(d);
            });
        }

        return { activeSeason: activeSeason, allSeasons: allSeasons }
    }

    return { activeSeason: activeSeason, allSeasons: allSeasons }
}