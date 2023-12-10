import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';
import type { MatchStatsTeam, MatchesWithSeasonName } from '$lib/types/newTypes';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getTeamsForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: teams, error: teamsError } = await supabase
				.from('teams')
				.select(
					`
						*,
						teams_players(player_id)
					`
				)
				.eq('season_id', season_id);

			if (teamsError) {
				throw error(500, {
					message: teamsError.message,
					devHelper: '/teams getting teams and players'
				});
			}

			return teams;
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

		const getFantasyTeamsForSeason = async (season_id: number, supabase: SupabaseClient<Database>) => {
			const { data: fantasyTeams, error: fantasyTeamsError } = await supabase
				.from('fantasy_teams')
				.select(
					`
						*,
						fantasy_teams_players(player_id)
					`
				)
				.eq('season_id', season_id);

			if (fantasyTeamsError) {
				throw error(500, {
					message: fantasyTeamsError.message,
					devHelper: '/fantasy_teams getting fantasy team and players'
				});
			}

			return fantasyTeams;
		};

		return {
			teams: getTeamsForSeason(season.id, supabase),
			allMatches: getMatchesForSeason(season.id, supabase),
			teamStats: getTeamStatsSeason(season.id, supabase),
			lazy: {
				fantasyTeams: getFantasyTeamsForSeason(season.id, supabase)
			}
		};
	}

	return {};
};
