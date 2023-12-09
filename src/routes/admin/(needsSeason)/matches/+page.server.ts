import type { Tables, TablesInsert } from '$lib/types/database.helper.types';
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
                    name,
                    color
                ),
                team_away:teams!matches_team_away_id_fkey(
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

	const seasonId = url.searchParams.get('season');

	if (session && seasonId) {
		if (!user?.is_admin && !user?.is_superadmin) {
			throw error(403, {
				message: 'Du har ikke rettigheter til å se denne siden'
			});
		}

		return {
			lazy: {
				matches: getMatches(Number(seasonId)),
				teams: getTeams(Number(seasonId))
			}
		};
	}

	return {
		lazy: {
			matches: [],
			teams: []
		}
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
