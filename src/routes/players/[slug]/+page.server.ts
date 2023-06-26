import type { PageServerLoad } from './$types';
import type { Player } from '$lib/types/newTypes';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ player: Player | null; }> = async (event) => {
    let player: Player | null = null;

    // Get all players
    const { supabaseClient } = await getSupabase(event);
    const playerQuery = await supabaseClient.from('players').select().eq("pid", parseInt(event.params.slug));

    // Map from db type to client type
    if (playerQuery.data != null) {
        const dbPlayer: Player = playerQuery.data[0];
        player = dbPlayer;
    }

    return { player: player }

}