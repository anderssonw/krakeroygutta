import { fetchAllMatchesForSeason } from '$lib/queries';
import { supabaseQuery } from '$lib/supabaseClient';
import type { Team } from '$lib/types/database-helpers';
import type { MatchDetails } from '$lib/types/match';
import type { PageServerLoad } from './$types';

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
		const homeTeamId = Number(formData.get('homeTeamId'));
		const awayTeamId = Number(formData.get('awayTeamId'));
		const seasonId = Number(formData.get('seasonId'));

		if (!homeTeamId || !awayTeamId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('matches').insert({
			team_home_id: homeTeamId,
			team_away_id: awayTeamId,
			season_id: seasonId
		});

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true };
	},

	createGoal: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const matchId = Number(formData.get('matchId'));
		const goalPlayerId = Number(formData.get('goalPlayerId'));
		const assistPlayerId = formData.get('assistPlayerId');
		const assistId = assistPlayerId ? Number(assistPlayerId) : null;

		if (!matchId || !goalPlayerId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('goals').insert({
			match_id: matchId,
			goal_player_id: goalPlayerId,
			assist_player_id: assistId
		});

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Mål lagt til' };
	},

	createClutch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const matchId = Number(formData.get('matchId'));
		const clutchPlayerId = Number(formData.get('clutchPlayerId'));

		if (!matchId || !clutchPlayerId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('clutches').insert({
			match_id: matchId,
			player_id: clutchPlayerId
		});

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'C-moment lagt til' };
	},

	deleteGoal: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const goalId = Number(formData.get('goalId'));

		if (!goalId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('goals').delete().eq('id', goalId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Mål slettet' };
	},

	deleteClutch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const clutchId = Number(formData.get('clutchId'));

		if (!clutchId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('clutches').delete().eq('id', clutchId);

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'C-moment slettet' };
	},

	deleteMatch: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const matchId = Number(formData.get('matchId'));

		if (!matchId) {
			return { success: false, message: 'Missing required fields' };
		}

		const { error } = await supabase.from('matches').delete().eq('id', matchId);

		const data = await supabaseQuery(supabase.from('goals').delete().eq('match_id', matchId), 'Deleting associated goals');

		if (error) {
			return { success: false, message: error.message };
		}

		return { success: true, message: 'Kamp slettet' };
	}
};
