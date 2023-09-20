import { type fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ZodError, z } from 'zod';
import type { TablesInsert } from '$lib/types/database.helper.types';

export const load: PageServerLoad = async ({ locals: { supabase }, url, parent }) => {
	const { session, user } = await parent();

	const getTeams = async (seasonIdParam: string) => {
		const { data: data, error: teamsError } = await supabase
			.from('teams')
			.select(`*, teams_players(player_id)`)
			.eq('season_id', seasonIdParam);

		if (teamsError) {
			throw error(500, {
				message: teamsError.message,
				devHelper: '/admin/teams getting teams'
			});
		}

		return data;
	};

	const getPlayers = async () => {
		const { data: data, error: playersError } = await supabase.from('players').select('id, name');

		if (playersError) {
			throw error(500, {
				message: playersError.message,
				devHelper: '/admin/teams getting players'
			});
		}

		return data;
	};

	const seasonIdParam = url.searchParams.get('season');
	if (!seasonIdParam) return {};

	if (session && user?.is_superadmin) {
		return { teams: getTeams(seasonIdParam), players: getPlayers(), seasonId: seasonIdParam };
	}

	return {};
};

const teamSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	color: z.string().min(1),
	players: z.number().array(),
	season_id: z.string()
});

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			console.log(formData);

			const res = teamSchema.parse(formData);

			let teamInsert: TablesInsert<'teams'> = {
				name: res.name,
				color: res.color,
				season_id: Number(res.season_id)
			};

			const { data: team, error: insertError } = await supabase.from('teams').insert(teamInsert).select().single();

			if (insertError) {
				throw error(500, {
					message: insertError.message,
					devHelper: '/admin/teams inserting team'
				});
			}

			let playersInsert: TablesInsert<'teams_players'>[] = res.players.map((id) => {
				return {
					player_id: id,
					team_id: team.id
				};
			});

			const { error: insertPlayersError } = await supabase.from('teams_players').insert(playersInsert);

			if (insertPlayersError) {
				throw error(500, {
					message: insertPlayersError.message,
					devHelper: '/admin/teams inserting team players'
				});
			}
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				console.log(errors);

				return {
					data: formData,
					errors
				};
			}
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const teamId = Number(formData.get('teamId'));
		const seasonId = Number(formData.get('seasonId'));

		if (seasonId && teamId) {
			const { error: deleteFail } = await supabase.from('teams').delete().eq('id', teamId).eq('season_id', seasonId);

			if (deleteFail) {
				throw error(500, {
					message: deleteFail.message,
					devHelper: '/admin/teams deleting team'
				});
			}
		}

		return { success: true };
	}
} satisfies Actions;
