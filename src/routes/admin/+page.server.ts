// import type { Player, Season, Stats, Team } from '$lib/types/newTypes';
// import type { PageServerLoad } from './$types';
// import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// export const load: PageServerLoad<{ allSeasons: Season[]; allPlayers: Player[]; allTeams: Team[]; allStats: Stats[] }> = async (event) => {
// 	const { activeSeason } = await event.parent();
// 	const { session, supabaseClient } = await getSupabase(event);

// 	let allSeasons: Season[] = [];
// 	let allPlayers: Player[] = [];
// 	let allTeams: Team[] = [];
// 	let allStats: Stats[] = [];

// 	if (session) {
// 		const seasonsQuery = await supabaseClient.from('seasons').select();
// 		if (seasonsQuery.data != null) {
// 			seasonsQuery.data.forEach((d: Season) => {
// 				allSeasons.push(d);
// 			});
// 		}

// 		const playersQuery = await supabaseClient.from('players').select();
// 		if (playersQuery.data != null) {
// 			playersQuery.data.forEach((d: Player) => {
// 				allPlayers.push(d);
// 			});
// 		}

// 		const teamsQuery = await supabaseClient.from('teams').select().eq('sid', activeSeason?.sid);
// 		if (teamsQuery.data != null) {
// 			teamsQuery.data.forEach((d: Team) => {
// 				allTeams.push(d);
// 			});
// 		}

// 		const statsQuery = await supabaseClient.from('playersstats').select().eq('sid', activeSeason?.sid);
// 		if (statsQuery.data != null) {
// 			statsQuery.data.forEach((d: Stats) => {
// 				allStats.push(d);
// 			});
// 		}

// 		return { allSeasons: allSeasons, allPlayers: allPlayers, allTeams: allTeams, allStats: allStats };
// 	}

// 	return { allSeasons: allSeasons, allPlayers: allPlayers, allTeams: allTeams, allStats: allStats };
// };

import { fail, type Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';

export const actions = {
	createSeason: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

        const seasonName = formData.get('seasonName')?.toString();
		const seasonStart = formData.get('seasonStart')?.toString();
        const seasonDeadline = formData.get('seasonDeadline')?.toString();
		const seasonEnd = formData.get('seasonEnd')?.toString();

        // Check overlapping dates
        let isOverlapDate: boolean = false;
        // Do this via database constraints?
        /*
        const seasonsQuery = await supabase.from('seasons').select();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);
                // Season start for the new season is overlapping with another season
                if (seasonStart >= seasonStart && seasonStart <= seasonEnd) {
                    isOverlapDate = true;
                }
                // Today is between start and end of the season => ongoing season
                if (seasonEnd >= seasonStart && seasonEnd <= seasonEnd) {
                    isOverlapDate = true;
                }
            });
        }
        */

        if (seasonName && seasonStart && seasonDeadline && seasonEnd && !isOverlapDate) {
            const seasonForm: TablesInsert<'seasons'> = {
                name: seasonName,
                start_time: seasonStart,
                deadline_time: seasonDeadline,
                end_time: seasonEnd
            }

            const { error: error } = await supabase.from('seasons').insert(seasonForm);

            if (error) {
				return fail(500, {
					supabaseErrorMessage: error.message
				});
			}
        }

        return { success: true };
	}
} satisfies Actions;