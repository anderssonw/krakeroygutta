import { fail, type Actions, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FantasyWithPlayers, FullPlayer, MatchStatsTeam, MatchesWithSeasonName } from '$lib/types/newTypes';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';
import { isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	// Get layout info
	const { season, session } = await parent();

	if (session) {
		if (!season) return {};

		const getPlayersForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: players, error: playersError } = await supabase
				.from('player_season_stats')
				.select(
					`   
						*
					`
				)
				.eq('season_id', season_id)
				.returns<FullPlayer[]>();

			if (playersError) {
				throw error(500, {
					message: playersError.message,
					devHelper: 'players/[slug] fetch player with stats'
				});
			}

			return players;
		};

		const getFantasyTeamForSeason = async (season_id: number, user_id: string, supabase: SupabaseClient<Database>) => {
			const { data: fantasyTeams, error: fantasyTeamsError } = await supabase
				.from('fantasy_with_players')
				.select(
					`   
						*
					`
				)
				.eq('user_id', user_id)
				.eq('season_id', season_id)
				.returns<FantasyWithPlayers[]>()
				.maybeSingle();

			if (fantasyTeamsError) {
				throw error(500, {
					message: fantasyTeamsError.message,
					devHelper: '/fantasy getting fantasy team for user'
				});
			}

			return fantasyTeams;
		};

		const getTeamStatsSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: teamStats, error: teamStatsError } = await supabase
				.from('team_with_stats')
				.select(
					`
						*
					`
				)
				.eq('season_id', season_id)
				.returns<MatchStatsTeam[]>();

			if (teamStatsError) {
				throw error(500, {
					message: teamStatsError.message,
					devHelper: '/team_with_stats getting team with player stats - view'
				});
			}

			return teamStats;
		};

		const getMatchesForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: matches, error: matchesError } = await supabase
				.from('matches')
				.select(
					`
						*,
						season_name:seasons(name)
					`
				)
				.eq('season_id', season_id)
				.returns<MatchesWithSeasonName[]>();

			if (matchesError) {
				throw error(500, {
					message: matchesError.message,
					devHelper: '/matches getting matches'
				});
			}

			return matches;
		};

		return {
			allPlayers: getPlayersForSeason(season.id, supabase),
			fantasyTeam: getFantasyTeamForSeason(season.id, session.user.id, supabase),
			allMatches: getMatchesForSeason(season.id, supabase),
			teamStats: getTeamStatsSeason(season.id, supabase)
		};
	}
	return {};
};

export const actions = {
	default: async ({ request, locals: { supabase, safeGetSession, getSeason } }) => {
		const formData = await request.formData();

		const name = String(formData.get('teamName'));
		const currencyLeft = Number(formData.get('currencyLeft'));
		const captainId = Number(formData.get('captainId'));
		const playerIds = formData.getAll('playerIds').map((id) => parseInt(id.toString()));

		let formHints: string[] = [];
		let formIsValid: boolean = true;

		if (!name || typeof name !== 'string') {
			formHints.push('Lagnavn er påkrevn');
			formIsValid = false;
		}
		if (playerIds.length > 0 && captainId < 0) {
			formHints.push('Du må velge kaptein');
			formIsValid = false;
		}

		const session = await safeGetSession();
		const season = await getSeason();

		if (session && season && session.user) {
			if (isSeasonPastDeadline(season)) {
				formHints.push('Sesongen er over, og du kan ikke lagre laget ditt lenger');
				formIsValid = false;
			}
			// Dette er egentlig en shitty måte å sjekke penger på, du kan sende inn hva som helst som currency left, burde kalkuleres ut i fra spillere
			// men sjansen for at folk prøver å hacke backenden??? nåvel
			if (season.starting_currency + currencyLeft < season.starting_currency) {
				formHints.push(`Du kan ikke bruke mer enn ${season.starting_currency} penger`);
				formIsValid = false;
			}

			if (!formIsValid) {
				return fail(400, {
					formHints
				});
			}

			let fantasyTeamToInsert = {
				name: name,
				season_id: season.id,
				captain_id: captainId > 0 ? captainId : null,
				user_id: session.user.id
			};

			let { data: currentFantasyTeam, error: fantasyTeamError } = await supabase
				.from('fantasy_teams')
				.select('*')
				.eq('season_id', season.id)
				.eq('user_id', session.user.id)
				.maybeSingle();

			if (fantasyTeamError) {
				throw error(500, {
					message: fantasyTeamError.message,
					devHelper: '/fantasy fetching current fantasy team'
				});
			}

			let fantasyTeamId = -1;

			if (currentFantasyTeam && currentFantasyTeam.id) {
				const { error: updateError } = await supabase.from('fantasy_teams').update(fantasyTeamToInsert).eq('id', currentFantasyTeam.id);

				if (updateError) {
					throw error(500, {
						message: updateError.message,
						devHelper: '/fantasy updating current fantasy team'
					});
				}

				fantasyTeamId = currentFantasyTeam.id;
			} else {
				const { data: newFantasyTeam, error: insertError } = await supabase
					.from('fantasy_teams')
					.insert(fantasyTeamToInsert)
					.select('id')
					.single();

				if (insertError) {
					throw error(500, {
						message: insertError.message,
						devHelper: '/fantasy inserting current fantasy team'
					});
				}

				if (!insertError) fantasyTeamId = newFantasyTeam.id;
			}

			const { error: deleteCurrentTeamError } = await supabase.from('fantasy_teams_players').delete().eq('fantasy_team_id', fantasyTeamId);

			if (deleteCurrentTeamError) {
				throw error(500, {
					message: deleteCurrentTeamError.message,
					devHelper: '/fantasy deleting fantasy team players'
				});
			}

			const { error: fantasyTeamsPlayersError } = await supabase.from('fantasy_teams_players').upsert(
				playerIds.map((id) => {
					return {
						fantasy_team_id: fantasyTeamId,
						player_id: id
					};
				})
			);

			if (fantasyTeamsPlayersError) {
				throw error(500, {
					message: fantasyTeamsPlayersError.message,
					devHelper: '/fantasy inserting/updating fantasy team players'
				});
			}
		}

		throw redirect(303, '/fantasy');
	}
} satisfies Actions;
