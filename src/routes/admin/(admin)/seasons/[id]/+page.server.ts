import { type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables, TablesUpdate } from '$lib/types/database.helper.types';
import { type PlayerWithStats } from './types';

export const load: PageServerLoad = async ({ params, locals: { supabase }, parent }) => {
	const { session, user } = await parent();

	if (session && user?.is_superadmin) {
		const { data: season, error: seasonsError } = await supabase.from('seasons').select().eq('id', params.id).single();

		if (seasonsError) {
			throw error(500, {
				message: seasonsError.message,
				devHelper: '/admin/seasons getting seasons'
			});
		}

		const { data: players } = await supabase.from('players').select('*, players_seasons(*)').eq('players_seasons.season_id', params.id);

		const playersWithStats = players?.map((player): PlayerWithStats => {
			const stats: Tables<'players_seasons'> | null = player.players_seasons[0];

			return {
				id: player.id,
				name: player.name,
				isInSeason: stats != null,
				stats: {
					attack: stats?.attack || 0,
					defence: stats?.defence || 0,
					physical: stats?.physical || 0,
					morale: stats?.morale || 0,
					skill: stats?.skill || 0,
					price: stats?.price || 0
				}
			};
		});

		return {
			season,
			players: playersWithStats
		};
	}

	return {};
};

export const actions = {
	update: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const seasonId = Number(formData.get('seasonId'));
		const seasonName = formData.get('seasonName')?.toString();
		const seasonStart = formData.get('seasonStart')?.toString();
		const seasonDeadline = formData.get('seasonDeadline')?.toString();
		const seasonEnd = formData.get('seasonEnd')?.toString();
		const startingCurrency = Number(formData.get('seasonStartingCurrency'));

		if (seasonId && seasonName && seasonStart && seasonDeadline && seasonEnd && startingCurrency) {
			const seasonForm: TablesUpdate<'seasons'> = {
				name: seasonName,
				start_time: seasonStart,
				deadline_time: seasonDeadline,
				end_time: seasonEnd,
				starting_currency: startingCurrency
			};

			const { error: updateError } = await supabase.from('seasons').update(seasonForm).eq('id', seasonId);

			if (updateError) {
				throw error(500, {
					message: updateError.message,
					devHelper: '/admin/seasons updating season'
				});
			}
		}

		return { success: true };
	}
} satisfies Actions;
