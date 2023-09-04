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
    user: User | null; // null because of non-verified users
    challengers: any[]; // any because User is faulty due to non-verified users
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
        .eq('season_id', season?.id).returns<Bet[]>();
    
    // Handle FAKE users (since they return NULL without email verification)
    const better: string = '25f77d08-43a9-44b1-99fb-67597562bcaf'; // Seed data
    const challenger: string = 'ec61970a-704a-4c92-8d54-1a3181175c91'; // Seed data
    if (bets) {
        bets[0].user = { id: better, nickname: 'Fake pimp 1'};
        bets[0].challengers[0] = { user: { id: challenger, nickname: 'Fake pimp 2'} };
    }

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

export const actions = {
	default: async ({ request, locals: { supabase, getSession, getUser, getSeason } }) => {
        // Form data
		const formData = await request.formData();
		const bet = formData.get('Veddemål')?.toString();
		const value = formData.get('Sats')?.toString();

        // Server data (can we get from PAGE instead of re-loading?)
		const session = await getSession();
        const user = await getUser();
        const season = await getSeason();

		if (session && user && season && bet && value) {
            // Using a GENERIC INSERT where id is optional
            const betForm: TablesInsert<'bets'> = {
                user_id: user.id,
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

        // Should not return true always
        return { success: true };
	}
} satisfies Actions;
