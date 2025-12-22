import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Database } from '$lib/types/database.generated.types';
import { supabaseQuery } from '$lib/supabaseClient';
import { zfd } from 'zod-form-data';
import z from 'zod';
import { isSeasonPastDeadline } from '$lib/season';

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
	better: BetUser;
	challengers: BetUser[];
};

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season, profile } = await parent();

	const betsData = await supabaseQuery(
		supabase.from('bets').select('*, users(*), bets_against(*, better:users(*))').eq('season_id', season.id)
	);

	if (betsData === null || betsData.length === 0) {
		return {
			bets: [],
			season,
			profile
		};
	}

	const bets: Bet[] = betsData.map((bet) => {
		const challengers = bet.bets_against.map((ba): BetUser => {
			return {
				id: ba.better.id,
				name: ba.better.nickname
			};
		});

		return {
			id: bet.id,
			bet: bet.bet,
			value: bet.value,
			season_id: bet.season_id,
			better: {
				id: bet.users.id,
				name: bet.users.nickname
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
		const { profile: user } = await safeGetSession();
		const season = await getSeason();

		if (!season) {
			return { success: false, message: 'Mangler sesong' };
		}

		if (isSeasonPastDeadline(season)) {
			return { success: false, message: 'Fristen for å opprette veddemål har gått ut' };
		}

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const createBetSchema = zfd.formData({
			bet: zfd.text(z.string().min(3, 'Veddemål må være minst 3 tegn langt')),
			value: zfd.numeric(z.number().int().positive())
		});

		const result = createBetSchema.safeParse(await request.formData());

		if (!result.success) {
			return { success: false, message: 'Valideringsfeil: ' + result.error.message };
		}

		const { bet, value } = result.data;

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
			value: value
		};

		const insertResult = await supabaseQuery(supabase.from('bets').insert(betForm).select(), 'veddemål: creating bet');

		if (!insertResult || insertResult.length === 0) {
			return { success: false, message: 'Kunne ikke opprette veddemål' };
		}

		return { success: true, message: 'Veddemål opprettet' };
	},

	addBetAgainst: async ({ request, locals: { supabase, getSeason, safeGetSession } }) => {
		const { profile: user } = await safeGetSession();
		const season = await getSeason();

		if (!season) {
			return { success: false, message: 'Mangler sesong' };
		}

		if (isSeasonPastDeadline(season)) {
			return { success: false, message: 'Fristen for å vedde har gått ut' };
		}

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const addBetAgainstSchema = zfd.formData({
			bet_id: zfd.numeric(z.number().int().positive())
		});

		const result = addBetAgainstSchema.safeParse(await request.formData());

		if (!result.success) {
			return { success: false, message: 'Valideringsfeil: ' + result.error.message };
		}

		const { bet_id } = result.data;

		// Check if user already has a bet against this bet
		const existingBetAgainst = await supabaseQuery(
			supabase.from('bets_against').select('id').eq('user_id', user.id).eq('bet_id', bet_id),
			'veddemål: checking existing bet against'
		);

		if (!existingBetAgainst || existingBetAgainst.length > 0) {
			return { success: false, message: 'Du har allerede veddet mot dette' };
		}

		const betAgainstForm: TablesInsert<'bets_against'> = {
			bet_id: bet_id,
			user_id: user.id
		};

		const insertResult = await supabaseQuery(supabase.from('bets_against').insert(betAgainstForm).select(), 'veddemål: adding bet against');

		if (!insertResult || insertResult.length === 0) {
			return { success: false, message: 'Kunne ikke legge til veddemål' };
		}

		return { success: true, message: 'Veddemål lagt til' };
	},

	removeBetAgainst: async ({ request, locals: { supabase, getSeason, safeGetSession } }) => {
		const { profile: user } = await safeGetSession();
		const season = await getSeason();

		if (!season) {
			return { success: false, message: 'Mangler sesong' };
		}

		if (isSeasonPastDeadline(season)) {
			return { success: false, message: 'Fristen for å fjerne veddemål har gått ut' };
		}

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const removeBetAgainstSchema = zfd.formData({
			bet_id: zfd.numeric(z.number().int().positive())
		});

		const result = removeBetAgainstSchema.safeParse(await request.formData());

		if (!result.success) {
			return { success: false, message: 'Valideringsfeil: ' + result.error.message };
		}

		const { bet_id } = result.data;

		const deleteResult = await supabaseQuery(
			supabase.from('bets_against').delete().eq('user_id', user.id).eq('bet_id', bet_id).select(),
			'veddemål: removing bet against'
		);

		if (!deleteResult || deleteResult.length === 0) {
			return { success: false, message: 'Kunne ikke fjerne veddemål' };
		}

		return { success: true, message: 'Veddemål fjernet' };
	},

	removeBet: async ({ locals: { supabase, getSeason, safeGetSession } }) => {
		const { profile: user } = await safeGetSession();
		const season = await getSeason();

		if (!season) {
			return { success: false, message: 'Mangler sesong' };
		}

		if (isSeasonPastDeadline(season)) {
			return { success: false, message: 'Fristen for å slette veddemål har gått ut' };
		}

		if (!user) {
			return { success: false, message: 'Mangler bruker' };
		}

		const deleteResult = await supabaseQuery(
			supabase.from('bets').delete().eq('user_id', user.id).eq('season_id', season.id).select(),
			'veddemål: removing bet'
		);

		if (!deleteResult || deleteResult.length === 0) {
			return { success: false, message: 'Kunne ikke slette veddemål' };
		}

		return { success: true, message: 'Veddemål slettet' };
	}
} satisfies Actions;
