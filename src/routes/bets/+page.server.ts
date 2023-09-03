import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

    /* TODO; Swap admin with username */
    /* TODO; User will return NULL with NON-VERIFIED USERS (fake users) */
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
        .eq('season_id', season?.id);

    // Handle FAKE users (since they return NULL without email verification)
    const better: string = '25f77d08-43a9-44b1-99fb-67597562bcaf'; // Seed data
    const challenger: string = 'ec61970a-704a-4c92-8d54-1a3181175c91'; // Seed data
    if (bets) {
        bets[0].user = { id: better, nickname: 'Fake pimp 1'};
        bets[0].challengers[0].user = { id: challenger, nickname: 'Fake pimp 2'};
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
	default: async ({ request, locals: { supabase, getSession, getUser } }) => {
		const formData = await request.formData();

		const bet = formData.get('Veddemål')?.toString();
		const value = formData.get('Sats')?.toString();

		const session = await getSession();
        const user = await getUser();
		if (session && user && bet && value) {
            // This is also done in fantasy, should be reworked (?)
			let todayTimeString = new Date().toDateString();
			const { data: season, error: seasonError } = await supabase
				.from('seasons')
				.select()
				.lt('start_time', todayTimeString)
				.gt('end_time', todayTimeString)
				.single();

			if (seasonError) {
				return fail(500, { message: 'There is no active season. Server could not handle your request.' });
			}

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

        return { success: true };
	}
} satisfies Actions;
