import type { PageServerLoad } from './$types';
import type { Player } from '$lib/types/newTypes';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ players: Player[]; }> = async (event) => {
    let players: Player[] = [];

    // Get all players
    const { supabaseClient } = await getSupabase(event);
	const playersQuery = await supabaseClient.from('players').select();

    // Map from db type to client type
    if (playersQuery.data != null) {
		playersQuery.data.forEach((d: Player) =>
			players.push(d)
		);
	}

    return { players: players }

}