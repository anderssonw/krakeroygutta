import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

    const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select(
            `
                *,
                bets_against(challenger)
            `
        )
        .eq('season_id', season?.id);
    
    if (betsError) {
        throw error(500, {
            message: betsError.message
        });
    }

    return {
        season,
        bets
    };
};
