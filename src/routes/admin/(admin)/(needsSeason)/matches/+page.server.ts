import type { TablesInsert } from '$lib/types/database.helper.types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { ZodError, z } from 'zod';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, url }) => {
	const { session, user } = await parent();

	const getMatches = async (seasonId: number) => {
		const { data: matches, error: matchesError } = await supabase
			.from('matches')
			.select(
				`
				*,
				team_home:teams!matches_team_home_id_fkey(
						id,
						name,
						color
				),
				team_away:teams!matches_team_away_id_fkey(
						id,
						name,
						color
				)
				`
			)
			.eq('season_id', seasonId);

		if (matchesError) {
			throw error(500, {
				message: matchesError.message,
				devHelper: '/admin/matches getting matches'
			});
		}

		return matches;
	};

	const getTeams = async (seasonId: number) => {
		const { data: teams, error: teamsError } = await supabase.from('teams').select().eq('season_id', seasonId);

		if (teamsError) {
			throw error(500, {
				message: teamsError.message,
				devHelper: '/admin/matches getting teams'
			});
		}

		return teams;
	};

	const getRelevantPlayers = async () => {
		const { data: players, error: playersError } = await supabase.from('teams_players').select(
			`
				team_id,
				players(
						id,
						name
				)
      `
		);

		if (playersError) {
			console.log(playersError);
			throw error(500, {
				message: playersError.message,
				devHelper: '/admin/matches getting players'
			});
		}

		return players;
	};

	const getGoals = async (matchIds: number[]) => {
		const { data: goals, error: goalsError } = await supabase.from('goals').select().in('match_id', matchIds);

		if (goalsError) {
			console.log(goalsError);
			throw error(500, {
				message: goalsError.message,
				devHelper: '/admin/matches getting goals'
			});
		}

		return goals;
	};

	const seasonId = url.searchParams.get('season');

	if (session && seasonId) {
		if (!user?.is_admin && !user?.is_superadmin) {
			throw error(403, {
				message: 'Du har ikke rettigheter til å se denne siden'
			});
		}

		const matches = await getMatches(Number(seasonId));

		const playersRes = await getRelevantPlayers();
		const players = playersRes.map((player) => {
			return {
				id: player.players?.id,
				name: player.players?.name,
				team_id: player.team_id
			};
		});

		return {
			matches: matches,
			teams: await getTeams(Number(seasonId)),
			players: players,
			goals: await getGoals(matches.map((match) => match.id))
		};
	}

	return {
		matches: [],
		teams: [],
		players: [],
		goals: []
	};
};

export const actions = {
	'create-match': async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const res = matchSchema.parse(formData);

			let matchInsert: TablesInsert<'matches'> = {
				season_id: Number(res.seasonId),
				team_home_id: Number(res.teamHomeId),
				team_away_id: Number(res.teamAwayId)
			};

			const { error: matchInsertError } = await supabase.from('matches').insert(matchInsert);

			if (matchInsertError) {
				throw error(500, {
					message: matchInsertError.message,
					devHelper: '/admin/matches inserting match'
				});
			}

			return {
				success: true
			};
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				return {
					create: {
						data: formData,
						errors
					}
				};
			}
		}

		return {};
	},
	'delete-match': async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const res = matchDeleteSchema.parse(formData);

			const { error: matchDeleteError } = await supabase.from('matches').delete().eq('id', res.id);

			if (matchDeleteError) {
				if (matchDeleteError.details.includes('is still referenced')) {
					let errors = {
						referenced: 'Denne kampen har mål og/eller se-momenter. Du kan ikke slette den med mindre du sletter disse'
					};
					return {
						delete: {
							data: formData,
							errors
						}
					};
				}

				throw error(500, {
					message: matchDeleteError.message,
					devHelper: '/admin/matches deleting match'
				});
			}

			return {
				success: true
			};
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				console.log(err);

				return {
					delete: {
						data: formData,
						errors
					}
				};
			}
		}

		return {};
	}
} satisfies Actions;

const matchSchema = z.object({
	id: z.string().optional(),
	teamAwayId: z.string().min(1, 'Du må velge bortelag'),
	teamHomeId: z.string().min(1, 'Du må velge hjemmelag'),
	seasonId: z.string().min(1, 'Du må velge sesong')
});

const matchDeleteSchema = z.object({
	id: z.string()
});
