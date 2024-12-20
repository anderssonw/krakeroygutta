import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer, MatchStatsTeam, MatchWithSeasonName } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, params }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const getPlayersForSeason = async () => {
			const { data: player, error: playerError } = await supabase
				.from('player_season_stats')
				.select()
				.eq('player_id', params.id)
				.returns<FullPlayer[]>();

			if (playerError) {
				throw error(500, {
					message: playerError.message,
					devHelper: 'players/[slug] fetch player with stats'
				});
			}

			return player;
		};

		const getMatchesForSeason = async () => {
			const { data: matches, error: matchesError } = await supabase
				.from('matches')
				.select(
					`
						*,
						season_name:seasons(name)
					`
				)
				.returns<MatchWithSeasonName[]>();

			if (matchesError) {
				throw error(500, {
					message: matchesError.message,
					devHelper: '/matches getting matches'
				});
			}

			return matches;
		};

		const getTeamStatsSeason = async () => {
			const { data: teamStats, error: teamStatsError } = await supabase
				.from('team_with_stats')
				.select(
					`
						*
					`
				)
				.returns<MatchStatsTeam[]>();

			if (teamStatsError) {
				throw error(500, {
					message: teamStatsError.message,
					devHelper: '/team_with_stats getting team with player stats - view'
				});
			}

			return teamStats;
		};

		return {
			playerVersions: getPlayersForSeason(),
			allMatches: getMatchesForSeason(),
			teamStats: getTeamStatsSeason()
		};
	}
	return {};
};
