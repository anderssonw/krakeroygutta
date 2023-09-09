import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';

// CUSTOM interface because we got 2nd relation keys
// Or just handle plain users. instead?
interface User {
    id: string;
    nickname: string;
}
export interface Bet {
    id: number;
    bet: string;
    value: number;
    user: User;
    challengers: any[];
}

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

    // Trying to access non-verified(email) users using the foreign key relation returns NULL !
    const { data: bets, error: betsError } = await supabase
        .from('bets')
        .select(
            `
                id,
                bet,
                value,
                user:users(
                    id,
                    nickname
                ),
                challengers:bets_against(
                    user:users(
                        id,
                        nickname
                    )
                )
            `
        )
        .eq('season_id', season?.id)
        .returns<Bet[]>();
    
    if (betsError) {
        throw error(500, {
            message: betsError.message
        });
    }
    

    return {
        bets
    };
};

export const actions = {
	default: async ({ request, locals: { supabase, getSession, getUser, getSeason } }) => {
        // Form data
		const formData = await request.formData();
		const bet = formData.get('bet')?.toString();
		const value = formData.get('value')?.toString();

        // Server data (can we get from PAGE instead of re-loading?)
		const session = await getSession();
        const season = await getSeason();

		if (session && season && bet && value) {
            // Using a GENERIC INSERT where id is optional
            const betForm: TablesInsert<'bets'> = {
                user_id: session.user.id,
                season_id: season.id,
                bet: bet,
                value: parseInt(value),
            }

            const { error: error } = await supabase.from('bets').insert(betForm);

			if (error) {
				return fail(500, {
					supabaseErrorMessage: error.message
				});
			}
        }
        
        return { success: true };
	}
} satisfies Actions;
