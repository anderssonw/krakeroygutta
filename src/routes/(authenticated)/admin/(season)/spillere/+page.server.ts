import { fetchAllMatchesForSeason, fetchAllSeasonsPlayersWithTeam } from '$lib/queries';
import { supabaseQuery } from '$lib/supabaseClient';
import type { Season } from '$lib/types/database-helpers';
import type { BasePlayer, SeasonPlayer } from '$lib/types/player';
import type { PageServerLoad } from './$types';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { form } from '$app/server';
import { fail } from '@sveltejs/kit';

interface PlayerWithPlayerSeason extends BasePlayer {
	currentSeasonInfo: SeasonPlayer | null;
	previousSeasonInfo: SeasonPlayer | null;
}

export const load = (async ({ locals: { supabase }, url }): Promise<{ players: PlayerWithPlayerSeason[] }> => {
	const seasonId = url.searchParams.get('seasonId');

	if (!seasonId) {
		return {
			players: []
		};
	}

	const players = await supabaseQuery<BasePlayer[]>(supabase.from('players').select('*'));

	if (!players) {
		return {
			players: []
		};
	}

	const playersSeasons = await fetchAllSeasonsPlayersWithTeam(supabase);

	const playersWithSeasonPlayer: PlayerWithPlayerSeason[] = players.map((player) => {
		const playerSeasonEntries = playersSeasons.filter((ps) => ps.id === player.id);

		const currentSeasonInfo = playerSeasonEntries.find((ps) => ps.season_id === Number(seasonId)) || null;

		const previousSeasonInfo =
			playerSeasonEntries.filter((ps) => ps.season_id !== Number(seasonId)).sort((a, b) => b.season_id - a.season_id)[0] || null;

		return {
			...player,
			currentSeasonInfo,
			previousSeasonInfo
		};
	});

	return {
		players: playersWithSeasonPlayer
	};
}) satisfies PageServerLoad;

export const actions = {
	addPlayerToSeason: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const addPlayerToSeasonSchema = zfd.formData({
			playerId: zfd.numeric(z.number().int().positive()),
			seasonId: zfd.numeric(z.number().int().positive())
		});

		const result = addPlayerToSeasonSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { playerId, seasonId } = result.data;

		// Get previous season stats if available
		const previousSeasonStats = await supabaseQuery(
			supabase
				.from('players_seasons')
				.select('attack, defence, physical, skill, morale, price')
				.eq('player_id', playerId)
				.order('season_id', { ascending: false })
				.limit(1)
		);

		if (!previousSeasonStats || previousSeasonStats.length > 1) {
			return fail(500, { message: 'Error fetching previous season stats' });
		}

		const previousStats = previousSeasonStats[0];

		const { data, error } = await supabase.from('players_seasons').insert({
			player_id: playerId,
			season_id: seasonId,
			attack: previousStats.attack ?? 50,
			defence: previousStats.defence ?? 50,
			physical: previousStats.physical ?? 50,
			skill: previousStats.skill ?? 50,
			morale: previousStats.morale ?? 50,
			price: previousStats.price ?? 3000
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, data };
	},

	removePlayerFromSeason: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const removePlayerFromSeasonSchema = zfd.formData({
			playerId: zfd.numeric(z.number().int().positive()),
			seasonId: zfd.numeric(z.number().int().positive())
		});

		const result = removePlayerFromSeasonSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { playerId, seasonId } = result.data;

		const { error } = await supabase.from('players_seasons').delete().eq('player_id', playerId).eq('season_id', seasonId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true };
	},

	updatePlayerForSeason: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const updatePlayerForSeasonSchema = zfd.formData({
			playerId: zfd.numeric(z.number().int().positive()),
			seasonId: zfd.numeric(z.number().int().positive()),
			attack: zfd.numeric(z.number().int().min(1).max(99)),
			defence: zfd.numeric(z.number().int().min(1).max(99)),
			physical: zfd.numeric(z.number().int().min(1).max(99)),
			skill: zfd.numeric(z.number().int().min(1).max(99)),
			morale: zfd.numeric(z.number().int().min(1).max(99)),
			price: zfd.numeric(z.number().int().min(500).max(10000)),
			inform_image: zfd.text(z.string().optional()),
			outofform_image: zfd.text(z.string().optional())
		});

		const result = updatePlayerForSeasonSchema.safeParse(formData);

		if (!result.success) {
			return fail(400, { message: 'Invalid form data', errors: z.treeifyError(result.error) });
		}

		const { playerId, seasonId, attack, defence, physical, skill, morale, price, inform_image, outofform_image } = result.data;

		if (inform_image && outofform_image) {
			return fail(400, { message: 'Du kan ikke sette både inform og out of form bilde samtidig.' });
		}

		const { error } = await supabase
			.from('players_seasons')
			.update({
				attack,
				defence,
				physical,
				skill,
				morale,
				price,
				inform_image: inform_image ? inform_image : null,
				outofform_image: outofform_image ? outofform_image : null
			})
			.eq('player_id', playerId)
			.eq('season_id', seasonId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true };
	}
};
