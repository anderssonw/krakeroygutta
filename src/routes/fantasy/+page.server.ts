import type { PageServerLoad } from './$types';
import type { Fantasy, Player } from '$lib/types/newTypes';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ fantasy: Fantasy | null; players: Player[] }> = async (event) => {
    // Get layout info
    const { user, activeSeason } = await event.parent();
    const { supabaseClient } = await getSupabase(event);

    let fantasy: Fantasy | null = null;
    let players: Player[] = [];

    // Get SID as a part of the select query

    // Get fantasy info
	const fantasyQuery = await supabaseClient.from('usersfantasy').select().eq("uid", user?.uid).eq("sid", activeSeason?.sid);
    // Map from db type to client type
    if (fantasyQuery.data != null) {
        if (fantasyQuery.data.length > 0) {
            fantasy = fantasyQuery.data[0]
        }
	}

    // Get fantasy info
	const playersQuery = await supabaseClient.from('players').select();
    // Map from db type to client type
    if (playersQuery.data != null) {
        playersQuery.data.forEach((d: Player) => {
            players.push(d);
        })
	}

    return { fantasy: fantasy, players: players }

}