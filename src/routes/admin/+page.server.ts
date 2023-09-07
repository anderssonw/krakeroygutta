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

import { fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
        console.log(formData);
        return { success: true };
        return fail(401)
	}
} satisfies Actions;