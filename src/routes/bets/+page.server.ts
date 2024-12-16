import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';
import type { Bet } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

	if (season == null) {
		throw error(500, {
			message: 'Mangler sesong, må ha sesong for bets'
		});
	}

	const { data: betsView, error: betsViewErrors } = await supabase
		.from('bets_with_challengers')
		.select(
			`
                *
            `
		)
		.eq('season_id', season.id)
		.returns<Bet[]>();

	if (betsViewErrors) {
		throw error(500, {
			message: betsViewErrors.message,
			devHelper: '/bets fetching bet information'
		});
	}

	const filteredBets = betsView?.map((bet) => {
		if (!bet.challengers[0].id) {
			bet.challengers = [];
			return bet;
		} else {
			return bet;
		}
	});

	return {
		bets: filteredBets
	};
};

export const actions = {
	createBet: async ({ request, locals: { supabase, getGuttaUser, getSeason } }) => {
		// Form data
		const formData = await request.formData();
		const bet = formData.get('bet')?.toString();
		const value = formData.get('value')?.toString();

		// Get from hooks
		const user = await getGuttaUser();
		const season = await getSeason();

		if (user && season && bet && value) {
			const betForm: TablesInsert<'bets'> = {
				user_id: user.id,
				season_id: season.id,
				bet: bet,
				value: parseInt(value)
			};

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
	addBetAgainst: async ({ request, locals: { supabase, getGuttaUser, getSeason } }) => {
		// Form data
		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

		// Get from hooks
		const user = await getGuttaUser();
		const season = await getSeason();

		if (user && season && bet_id) {
			const betAgainstForm: TablesInsert<'bets_against'> = {
				bet_id: parseInt(bet_id),
				user_id: user.id
			};
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
	removeBetAgainst: async ({ request, locals: { supabase, getGuttaUser, getSeason } }) => {
		// Form data
		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

		// Get from hooks
		const user = await getGuttaUser();
		const season = await getSeason();

		if (user && season && bet_id) {
			const { error: deleteError } = await supabase.from('bets_against').delete().eq('user_id', user.id).eq('bet_id', parseInt(bet_id));

			if (deleteError) {
				throw error(500, {
					message: deleteError.message,
					devHelper: '/bets deleting a bet_against'
				});
			}
		}

		throw redirect(302, '/bets');
	},
	removeBet: async ({ locals: { supabase, getGuttaUser, getSeason } }) => {
		// Get from hooks
		const user = await getGuttaUser();
		const season = await getSeason();

		if (user && season) {
			const { error: deleteError } = await supabase.from('bets').delete().eq('user_id', user.id).eq('season_id', season.id);

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
