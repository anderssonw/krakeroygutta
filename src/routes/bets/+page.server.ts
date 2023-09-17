import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';
import type { Bet } from '$lib/types/newTypes';


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
                message: betsError.message,
                devHelper: '/bets fetching bet information'
            });
        }
    

    return {
        bets
    };
};

export const actions = {
	createBet: async ({ request, locals: { supabase, getSession, getSeason } }) => {
        // Form data
		const formData = await request.formData();
		const bet = formData.get('bet')?.toString();
		const value = formData.get('value')?.toString();

        // Get from hooks
		const session = await getSession();
        const season = await getSeason();

		if (session && season && bet && value) {
            const betForm: TablesInsert<'bets'> = {
                user_id: session.user.id,
                season_id: season.id,
                bet: bet,
                value: parseInt(value),
            }

            const { error: insertError } = await supabase.from('bets').insert(betForm);

			if (insertError) {
                throw error(500, {
                    message: insertError.message,
                    devHelper: '/bets inserting a bet'
                });
			}
        }
        
        throw redirect(302, '/bets');
	},
    addBetAgainst: async ({ request, locals: { supabase, getSession, getSeason } }) => {
        // Form data
		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

        // Get from hooks
		const session = await getSession();
        const season = await getSeason();

		if (session && season && bet_id) {
            const betAgainstForm: TablesInsert<'bets_against'> = {
                bet_id: parseInt(bet_id),
                user_id: session.user.id,
            }
            const { error: insertError } = await supabase.from('bets_against').insert(betAgainstForm);

			if (insertError) {
                throw error(500, {
                    message: insertError.message,
                    devHelper: '/bets inserting a bet_against'
                });
			}
        }
        
        throw redirect(302, '/bets');
	},
    removeBetAgainst: async ({ request, locals: { supabase, getSession, getSeason } }) => {
        // Form data
		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

        // Get from hooks
		const session = await getSession();
        const season = await getSeason();

		if (session && season && bet_id) {
            const { error: deleteError } = await supabase.from('bets_against').delete()
                .eq('user_id', session.user.id)
                .eq('bet_id', parseInt(bet_id));

			if (deleteError) {
                throw error(500, {
                    message: deleteError.message,
                    devHelper: '/bets deleting a bet_against'
                });
			}
        }

        throw redirect(302, '/bets');
	},
    removeBet: async ({ locals: { supabase, getSession, getSeason } }) => {
        // Get from hooks
		const session = await getSession();
        const season = await getSeason();

		if (session && season) {
            const { error: deleteError } = await supabase.from('bets').delete()
                .eq('user_id', session.user.id)
                .eq('season_id', season.id);

			if (deleteError) {
                throw error(500, {
                    message: deleteError.message,
                    devHelper: '/bets deleting a bet'
                });
			}
        }
        
        throw redirect(302, '/bets');
	}
} satisfies Actions;
