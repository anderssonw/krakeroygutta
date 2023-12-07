import { type fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ZodError, z } from 'zod';
import type { TablesInsert, TablesUpdate } from '$lib/types/database.helper.types';

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

	const getPlayers = async (seasonId: string) => {
		const { data: data, error: playersError } = await supabase
			.from('players_seasons')
			.select('...players(id, name)')
			.eq('season_id', seasonId);

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
		return { teams: getTeams(seasonIdParam), players: getPlayers(seasonIdParam), seasonId: Number(seasonIdParam) };
	}

	return {};
};

const teamSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	color: z.string().min(1),
	players: z.string().optional(),
	season_id: z.string()
});

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const res = teamSchema.parse(formData);

			console.log(res);

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

			if (res.players) {
				let playerIds = res.players.split(',');
				let playersInsert: TablesInsert<'teams_players'>[] = playerIds.map((id) => {
					return {
						player_id: Number(id),
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
			}

			return {
				teamInsert: {
					success: true,
					data: {
						season_id: res.season_id
					}
				}
			};
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				console.log(errors);

				return {
					create: {
						data: formData,
						errors
					}
				};
			}
		}
	},

	update: async ({ request, locals: { supabase } }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const res = teamSchema.parse(formData);

			console.log('zod res', res);

			if (res.id) {
				const { data: matches, error: matchesError } = await supabase
					.from('matches')
					.select()
					.or(`team_home_id.eq.${res.id},team_away_id.eq.${res.id}`);

				console.log('matches', matches);

				if (matchesError) {
					throw error(500, {
						message: matchesError.message,
						devHelper: '/admin/teams selecting matches (checking if should delete players/team)'
					});
				}

				if (matches && matches.length === 0) {
					console.log('boutta update');
					const { error: deletePlayersFail } = await supabase.from('teams_players').delete().eq('team_id', res.id);

					if (deletePlayersFail) {
						throw error(500, {
							message: deletePlayersFail.message,
							devHelper: '/admin/teams deleting team_players while updating'
						});
					}

					if (res.players) {
						let playerIds = res.players.split(',');
						let playersInsert: TablesInsert<'teams_players'>[] = playerIds.map((id) => {
							return {
								player_id: Number(id),
								team_id: Number(res.id)
							};
						});

						console.log('playersinsert', playersInsert);

						const { error: insertPlayersError } = await supabase.from('teams_players').insert(playersInsert);

						if (insertPlayersError) {
							throw error(500, {
								message: insertPlayersError.message,
								devHelper: '/admin/teams inserting team players while updating'
							});
						}
					}

					let teamUpdate: TablesUpdate<'teams'> = {
						id: Number(res.id),
						name: res.name,
						color: res.color,
						season_id: Number(res.season_id)
					};

					console.log('teamupdate', teamUpdate);

					const { error: updateTeamError } = await supabase.from('teams').update(teamUpdate).eq('id', res.id);

					if (updateTeamError) {
						throw error(500, {
							message: updateTeamError.message,
							devHelper: '/admin/teams update team'
						});
					}

					return {
						teamUpdate: {
							success: true
						}
					};
				} else {
					return {
						updatePlayers: {
							error:
								'Du kan ikke oppdatere et lag dersom dette laget har spilt kamper. Om du fortsatt ønsker å slette laget må du først slette kampene deres.'
						}
					};
				}
			}
		} catch (err) {
			if (err instanceof ZodError) {
				const { fieldErrors: errors } = err.flatten();

				console.log('zod err', err);

				return {
					update: {
						data: formData,
						errors
					}
				};
			}
		}
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const teamId = Number(formData.get('teamId'));
		const seasonId = Number(formData.get('seasonId'));

		if (seasonId && teamId) {
			const { data: matches, error: matchesError } = await supabase
				.from('matches')
				.select()
				.or(`team_home_id.eq.${teamId},team_away_id.eq.${teamId}`);

			if (matchesError) {
				throw error(500, {
					message: matchesError.message,
					devHelper: '/admin/teams selecting matches (checking if should delete players/team)'
				});
			}

			if (matches && matches.length === 0) {
				const { error: deletePlayersFail } = await supabase.from('teams_players').delete().eq('team_id', teamId);

				if (deletePlayersFail) {
					throw error(500, {
						message: deletePlayersFail.message,
						devHelper: '/admin/teams deleting team_players'
					});
				}

				const { error: deleteFail } = await supabase.from('teams').delete().eq('id', teamId).eq('season_id', seasonId);

				if (deleteFail) {
					throw error(500, {
						message: deleteFail.message,
						devHelper: '/admin/teams deleting team'
					});
				}
			} else {
				return {
					deletePlayers: {
						error:
							'Du kan ikke slette et lag dersom dette laget har spilt kamper. Om du fortsatt ønsker å slette laget må du først slette kampene deres.'
					}
				};
			}
		}

		return {
			teamDelete: {
				success: true
			}
		};
	}
} satisfies Actions;
