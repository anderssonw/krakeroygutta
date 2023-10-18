import type { Tables, TablesInsert } from '$lib/types/database.helper.types';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { ZodError, z } from 'zod';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, url }) => {
	const { session, user } = await parent();

	const getMatches = async (seasonId: number) => {
		const { data: matches, error: matchesError } = await supabase.from('matches').select().eq('season_id', seasonId);

		if (matchesError) {
			throw error(500, {
				message: matchesError.message,
				devHelper: '/admin/matches getting matches'
			});
		}

		return matches;
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
				matches: getMatches(Number(seasonId))
			}
		};
	}

	return {
		lazy: {
			matches: [] as Tables<'matches'>[]
		}
	};
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log(formData);

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
	}
} satisfies Actions;

const matchSchema = z.object({
	id: z.string().optional(),
	teamAwayId: z.string().min(1, 'Du må velge bortelag'),
	teamHomeId: z.string().min(1, 'Du må velge hjemmelag'),
	seasonId: z.string().min(1, 'Du må velge sesong')
});
