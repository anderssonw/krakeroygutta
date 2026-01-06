import { fetchAllMatchesForSeason } from '$lib/queries';
import { supabaseQuery } from '$lib/supabaseClient';
import type { Team } from '$lib/types/database-helpers';
import type { MatchDetails } from '$lib/types/match';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

type AdminMatchesLoad = {
	matches: MatchDetails[];
	teams: Team[];
};
export const load = (async ({ locals: { supabase }, url }): Promise<AdminMatchesLoad> => {
	const seasonId = url.searchParams.get('seasonId');

	if (!seasonId) {
		return { matches: [], teams: [] };
	}

	const matches = await fetchAllMatchesForSeason(supabase, Number(seasonId));

	// Fetch teams for the season for creating new matches
	const teams = await supabaseQuery(supabase.from('teams').select('*').eq('season_id', Number(seasonId)));

	return {
		matches: matches.reverse(), // Sort newest first
		teams: teams ?? []
	};
}) satisfies PageServerLoad;

// TODO Zod og riktig validering med supabasequery?
export const actions = {
	createMatch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const createMatchSchema = zfd.formData({
			homeTeamId: zfd.numeric(z.number().int().positive()),
			awayTeamId: zfd.numeric(z.number().int().positive()),
			seasonId: zfd.numeric(z.number().int().positive())
		});

		const result = createMatchSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { homeTeamId, awayTeamId, seasonId } = result.data;

		const { error } = await supabase.from('matches').insert({
			team_home_id: homeTeamId,
			team_away_id: awayTeamId,
			season_id: seasonId
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true };
	},

	createGoal: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const createGoalSchema = zfd.formData({
			matchId: zfd.numeric(z.number().int().positive()),
			goalPlayerId: zfd.numeric(z.number().int().positive()),
			assistPlayerId: zfd.numeric(z.number().int().positive().optional())
		});

		const result = createGoalSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { matchId, goalPlayerId, assistPlayerId } = result.data;

		const { error } = await supabase.from('goals').insert({
			match_id: matchId,
			goal_player_id: goalPlayerId,
			assist_player_id: assistPlayerId ?? null
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Mål lagt til' };
	},

	createClutch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const createClutchSchema = zfd.formData({
			matchId: zfd.numeric(z.number().int().positive()),
			clutchPlayerId: zfd.numeric(z.number().int().positive()),
			isNegative: zfd.checkbox()
		});

		const result = createClutchSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { matchId, clutchPlayerId, isNegative } = result.data;

		const { error } = await supabase.from('clutches').insert({
			match_id: matchId,
			player_id: clutchPlayerId,
			is_negative: isNegative
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'C-moment lagt til' };
	},

	deleteGoal: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const deleteGoalSchema = zfd.formData({
			goalId: zfd.numeric(z.number().int().positive())
		});

		const result = deleteGoalSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { goalId } = result.data;

		const { error } = await supabase.from('goals').delete().eq('id', goalId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Mål slettet' };
	},

	deleteClutch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const deleteClutchSchema = zfd.formData({
			clutchId: zfd.numeric(z.number().int().positive())
		});

		const result = deleteClutchSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { clutchId } = result.data;

		const { error } = await supabase.from('clutches').delete().eq('id', clutchId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'C-moment slettet' };
	},

	deleteMatch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const deleteMatchSchema = zfd.formData({
			matchId: zfd.numeric(z.number().int().positive())
		});

		const result = deleteMatchSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { matchId } = result.data;

		const { error } = await supabase.from('matches').delete().eq('id', matchId);

		const data = await supabaseQuery(supabase.from('goals').delete().eq('match_id', matchId), 'Deleting associated goals');

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Kamp slettet' };
	}
};
