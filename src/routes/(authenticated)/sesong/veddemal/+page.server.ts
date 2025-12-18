import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/types/database.generated.types';
import { supabaseQuery } from '$lib/supabaseClient';

type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

type BetUser = {
	id: string;
	name: string;
};

type Bet = {
	id: number;
	bet: string;
	value: number;
	season_id: number;
	better: BetUser | null;
	challengers: BetUser[];
};

// TODO Hele veddemål er reinspikka vibe coda for å få det ferdig, så det bør nok fikses opp

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season, profile } = await parent();

	const betsData = await supabaseQuery(
		supabase.from('bets').select('*, users(*), bets_against(*, better:users(*))').eq('season_id', season.id)
	);

	// Filter out null challengers and properly type the data
	const bets: Bet[] = (betsData ?? []).map((bet) => {
		const challengers = bet.bets_against.map((ba): BetUser => {
			return {
				id: ba.better?.id ?? '',
				name: ba.better?.nickname ?? ''
			};
		});

		return {
			id: bet.id ?? 0,
			bet: bet.bet ?? '',
			value: bet.value ?? 0,
			season_id: bet.season_id ?? 0,
			better: {
				id: bet.users?.id ?? '',
				name: bet.users?.nickname ?? ''
			},
			challengers
		};
	});

	return {
		bets,
		season,
		profile
	};
}) satisfies PageServerLoad;

export const actions = {
	createBet: async ({ request, locals: { supabase, getSeason, safeGetSession } }) => {
		const season = await getSeason();
		const { profile: user } = await safeGetSession();

		if (!season || !user) {
			return { success: false, message: 'Mangler sesong eller bruker' };
		}

		const formData = await request.formData();
		const bet = formData.get('bet')?.toString();
		const value = formData.get('value')?.toString();

		if (!bet || !value) {
			return { success: false, message: 'Mangler veddemål eller sats' };
		}

		// Check if user already has a bet for this season
		const existingBet = await supabaseQuery(
			supabase.from('bets').select('id').eq('user_id', user.id).eq('season_id', season.id),
			'veddemål: checking existing bet'
		);

		if (!existingBet || existingBet.length > 0) {
			return { success: false, message: 'Du har allerede opprettet et veddemål' };
		}

		const betForm: TablesInsert<'bets'> = {
			user_id: user.id,
			season_id: season.id,
			bet: bet,
			value: parseInt(value)
		};

		await supabaseQuery(supabase.from('bets').insert(betForm), 'veddemål: creating bet');
	},

	addBetAgainst: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { profile: user } = await safeGetSession();

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

		if (!bet_id) {
			return { success: false, message: 'Mangler veddemål ID' };
		}

		const betAgainstForm: TablesInsert<'bets_against'> = {
			bet_id: parseInt(bet_id),
			user_id: user.id
		};

		await supabaseQuery(supabase.from('bets_against').insert(betAgainstForm), 'veddemål: adding bet against');

		redirect(303, '/sesong/veddemal');
	},

	removeBetAgainst: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { profile: user } = await safeGetSession();

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const formData = await request.formData();
		const bet_id = formData.get('bet_id')?.toString();

		if (!bet_id) {
			return { success: false, message: 'Mangler veddemål ID' };
		}

		await supabaseQuery(
			supabase.from('bets_against').delete().eq('user_id', user.id).eq('bet_id', parseInt(bet_id)),
			'veddemål: removing bet against'
		);

		redirect(303, '/sesong/veddemal');
	},

	removeBet: async ({ locals: { supabase, getSeason, safeGetSession } }) => {
		const season = await getSeason();
		const { profile: user } = await safeGetSession();

		if (!season || !user) {
			return { success: false, message: 'Mangler sesong eller bruker' };
		}

		await supabaseQuery(supabase.from('bets').delete().eq('user_id', user.id).eq('season_id', season.id), 'veddemål: removing bet');

		redirect(303, '/sesong/veddemal');
	}
} satisfies Actions;
