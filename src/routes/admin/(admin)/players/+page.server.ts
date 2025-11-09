import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StandardPlayer, StandardPlayerSeason } from '$lib/types/newTypes';
import { z } from 'zod';
import type { TablesInsert, TablesUpdate } from '$lib/types/database.generated.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { session, user, season, previousSeason } = await parent();

	const getAllPlayers = async () => {
		const { data: players, error: playersError } = await supabase
			.from('players')
			.select(
				`   
                    *
                `
			)
			.overrideTypes<StandardPlayer[]>();

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/admin/players fetch players'
			});
		}

		return players;
	};

	const getPlayersPerSeason = async () => {
		const { data: players, error: playersError } = await supabase
			.from('players_seasons')
			.select(
				`   
                    *
                `
			)
			.overrideTypes<StandardPlayerSeason[]>();

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/admin/players fetch season stats for players'
			});
		}

		return players;
	};

	if (session && user?.is_superadmin) {
		return {
			season: season,
			previousSeason: previousSeason,
			allPlayers: await getAllPlayers(),
			playersPerSeason: await getPlayersPerSeason()
		};
	}

	return {};
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		try {
			const res = createSchema.parse(formData);

			let playerSeasonInsert: TablesInsert<'players_seasons'> = {
				player_id: Number(res.player_id),
				season_id: Number(res.season_id),
				attack: Number(res.attack),
				defence: Number(res.defence),
				physical: Number(res.physical),
				morale: Number(res.morale),
				skill: Number(res.skill),
				price: Number(res.price),
				inform_image: null,
				outofform_image: null
			};

			const { error: insertPlayersError } = await supabase.from('players_seasons').insert(playerSeasonInsert);

			if (insertPlayersError) {
				throw error(500, {
					message: insertPlayersError.message,
					devHelper: '/admin/players inserting player'
				});
			}
		} catch (err) {
			console.log(err);
		}
	},

	update: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		try {
			const res = updateSchema.parse(formData);

			let playerSeasonUpdate: TablesUpdate<'players_seasons'> = {
				attack: Number(res.attack),
				defence: Number(res.defence),
				physical: Number(res.physical),
				morale: Number(res.morale),
				skill: Number(res.skill),
				price: Number(res.price),
				inform_image: res.inform_image,
				outofform_image: res.outofform_image
			};

			const { error: updatePlayersError } = await supabase
				.from('players_seasons')
				.update(playerSeasonUpdate)
				.eq('player_id', Number(res.player_id))
				.eq('season_id', Number(res.season_id));

			if (updatePlayersError) {
				throw error(500, {
					message: updatePlayersError.message,
					devHelper: '/admin/players updating player'
				});
			}
		} catch (err) {
			console.log(err);
		}
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());
		try {
			const res = createSchema.parse(formData);

			const { error: deletePlayersError } = await supabase
				.from('players_seasons')
				.delete()
				.eq('player_id', Number(res.player_id))
				.eq('season_id', Number(res.season_id));

			if (deletePlayersError) {
				throw error(500, {
					message: deletePlayersError.message,
					devHelper: '/admin/players deleting player'
				});
			}
		} catch (err) {
			console.log(err);
		}
	}
} satisfies Actions;

const createSchema = z.object({
	player_id: z.string(),
	season_id: z.string(),
	attack: z.string(),
	defence: z.string(),
	physical: z.string(),
	morale: z.string(),
	skill: z.string(),
	price: z.string()
});

const updateSchema = z.object({
	player_id: z.string(),
	season_id: z.string(),
	inform_image: z.string().nullable(),
	outofform_image: z.string().nullable(),
	attack: z.string(),
	defence: z.string(),
	physical: z.string(),
	morale: z.string(),
	skill: z.string(),
	price: z.string()
});
