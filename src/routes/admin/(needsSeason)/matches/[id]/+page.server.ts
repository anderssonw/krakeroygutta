import type { TablesInsert } from '$lib/types/database.helper.types';
import { error, type Actions, fail } from '@sveltejs/kit';
import { ZodError, z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, params: { id } }) => {
	const { session, user } = await parent();

	const getMatch = async () => {
		const { data: match, error: matchesError } = await supabase
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
			.eq('id', id)
			.single();

		if (matchesError) {
			console.log(matchesError);
			throw error(500, {
				message: matchesError.message,
				devHelper: '/admin/matches getting matches'
			});
		}

		return match;
	};

	const getRelevantPlayers = async (homeTeamId: number, awayTeamId: number) => {
		const { data: players, error: playersError } = await supabase
			.from('teams_players')
			.select(
				`
                players(
                    id,
                    name
                )
            `
			)
			.or(`team_id.eq.${homeTeamId},team_id.eq.${awayTeamId}`);

		if (playersError) {
			console.log(playersError);
			throw error(500, {
				message: playersError.message,
				devHelper: '/admin/matches getting players'
			});
		}

		return players;
	};

	const getGoals = async (matchId: number) => {
		const { data: goals, error: goalsError } = await supabase.from('goals').select().eq('match_id', matchId);

		if (goalsError) {
			console.log(goalsError);
			throw error(500, {
				message: goalsError.message,
				devHelper: '/admin/matches getting goals'
			});
		}

		return goals;
	};

	const getAssists = async (matchId: number) => {
		const { data: assists, error: assistsError } = await supabase.from('assists').select().eq('match_id', matchId);

		if (assistsError) {
			console.log(assistsError);
			throw error(500, {
				message: assistsError.message,
				devHelper: '/admin/matches getting assists'
			});
		}

		return assists;
	};

	const getClutches = async (matchId: number) => {
		const { data: clutches, error: clutchesError } = await supabase.from('clutches').select().eq('match_id', matchId);

		if (clutchesError) {
			console.log(clutchesError);
			throw error(500, {
				message: clutchesError.message,
				devHelper: '/admin/matches getting clutches'
			});
		}

		return clutches;
	};

	if (session) {
		if (!user?.is_admin && !user?.is_superadmin) {
			throw error(403, {
				message: 'Du har ikke rettigheter til å se denne siden'
			});
		}

		const match = await getMatch();
		const playersRes = await getRelevantPlayers(match.team_home_id, match.team_away_id);
		const players = playersRes.map((player) => {
			return {
				id: player.players?.id,
				name: player.players?.name
			};
		});
		return {
			match,
			players,
			lazy: {
				goals: getGoals(match.id),
				assists: getAssists(match.id),
				clutches: getClutches(match.id)
			}
		};
	}

	// return {
	// 	lazy: {
	// 		matches: [] as Tables<'matches'>[]
	// 	}
	// };
};

export const actions = {
	'create-clutch': async ({ request, locals: { supabase }, params: { id } }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log(formData);

		if (!id) throw fail(401);

		try {
			const res = clutchInsertSchema.parse(formData);

			let clutchInsert: TablesInsert<'clutches'> = {
				match_id: Number(id),
				player_id: Number(res.clutch)
			};

			const { error: clutchInsertError } = await supabase.from('clutches').insert(clutchInsert);

			if (clutchInsertError) {
				throw error(500, {
					message: clutchInsertError.message,
					devHelper: '/admin/matches/[id] inserting clutch'
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

	'delete-clutch': async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log(formData);

		try {
			const res = clutchDeleteSchema.parse(formData);

			const { error: clutchDeleteError } = await supabase.from('clutches').delete().eq('id', res.clutch_id);

			if (clutchDeleteError) {
				throw error(500, {
					message: clutchDeleteError.message,
					devHelper: '/admin/matches/[id] deleting clutch'
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

	'create-goal-assist': async ({ request, locals: { supabase }, params: { id } }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log(formData);

		if (!id) throw fail(401);

		try {
			const res = goalAssistInsertSchema.parse(formData);

			let goalInsert: TablesInsert<'goals'> = {
				match_id: Number(id),
				player_id: Number(res.goal)
			};

			let assistInsert: TablesInsert<'assists'> = {
				match_id: Number(id),
				player_id: Number(res.assist)
			};

			const { error: goalInsertError } = await supabase.from('goals').insert(goalInsert);
			const { error: assistInsertError } = await supabase.from('assists').insert(assistInsert);

			if (goalInsertError) {
				throw error(500, {
					message: goalInsertError.message,
					devHelper: '/admin/matches/[id] inserting goal'
				});
			}

			if (assistInsertError) {
				throw error(500, {
					message: assistInsertError.message,
					devHelper: '/admin/matches/[id] inserting assist'
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
	},

	'delete-goal-assist': async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		console.log(formData);

		try {
			const res = goalAssistDeleteSchema.parse(formData);

			const { error: goalDeleteError } = await supabase.from('goals').delete().eq('id', res.goal_id);
			const { error: assistDeleteError } = await supabase.from('assists').delete().eq('id', res.assist_id);

			if (goalDeleteError) {
				throw error(500, {
					message: goalDeleteError.message,
					devHelper: '/admin/matches/[id] deleting goal'
				});
			}

			if (assistDeleteError) {
				throw error(500, {
					message: assistDeleteError.message,
					devHelper: '/admin/matches/[id] deleting assist'
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

const goalAssistInsertSchema = z.object({
	goal: z.string().min(1, 'Du må velge hvem som fikk mål'),
	assist: z.string().min(1, 'Du må velge hvem som fikk assist')
});

const goalAssistDeleteSchema = z.object({
	goal_id: z.preprocess(Number, z.number()),
	assist_id: z.preprocess(Number, z.number())
});

const clutchInsertSchema = z.object({
	clutch: z.string().min(1, 'Du må velge hvem som fikk se-moment')
});

const clutchDeleteSchema = z.object({
	clutch_id: z.preprocess(Number, z.number())
});
