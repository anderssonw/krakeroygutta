import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { MatchStatsTeam, MatchWithSeasonName, StandardPlayer } from '$lib/types/newTypes';

export const load = (async ({ locals: { supabase }, url }) => {
	const getFantasyTeamPlayersForSeason = async (seasonId: number) => {
		const { data: players, error: playersError } = await supabase
			.from('fantasy_teams')
			.select(
				`
				id,
				players:fantasy_teams_players(player_id)
				`
			)
			.eq('season_id', seasonId);

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/statistics getting players'
			});
		}

		return players;
	};

	const getPlayers = async (seasonId: number) => {
		const { data: players, error: playersError } = await supabase
			.from('players_seasons')
			.select('...players(id, name, image)')
			.eq('season_id', seasonId)
			.returns<StandardPlayer[]>();

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/statistics getting matches'
			});
		}

		return players;
	};

	const getMatchesForSeason = async (seasonId: number) => {
		const { data: matches, error: matchesError } = await supabase
			.from('matches')
			.select(
				`
						*,
						season_name:seasons(name)
					`
			)
			.eq('season_id', seasonId)
			.returns<MatchWithSeasonName[]>();

		if (matchesError) {
			error(500, {
				message: matchesError.message,
				devHelper: '/statistics getting matches'
			});
		}

		return matches;
	};

	const getTeamStatsSeason = async (season_id: number) => {
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
			error(500, {
				message: teamStatsError.message,
				devHelper: '/team_with_stats getting team with player stats - view'
			});
		}

		return teamStats;
	};

	const getGoals = async (matchIds: number[]) => {
		const { data: goals, error: goalsError } = await supabase.from('goals').select().in('match_id', matchIds);

		if (goalsError) {
			error(500, {
				message: goalsError.message,
				devHelper: '/statistics getting goals'
			});
		}

		return goals;
	};

	const getClutches = async (matchIds: number[]) => {
		const { data: clutches, error: clutchesError } = await supabase.from('clutches').select().in('match_id', matchIds);

		if (clutchesError) {
			error(500, {
				message: clutchesError.message,
				devHelper: '/statistics getting clutches'
			});
		}

		return clutches;
	};

	const seasonId = Number(url.searchParams.get('season'));

	if (seasonId) {
		const matches = await getMatchesForSeason(seasonId);

		return {
			players: getPlayers(seasonId),
			allMatches: matches,
			teamStats: getTeamStatsSeason(seasonId),
			lazy: {
				fantasyTeamPlayers: getFantasyTeamPlayersForSeason(seasonId),
				goals: getGoals(matches.map((match) => match.id)),
				clutches: getClutches(matches.map((match) => match.id))
			}
		};
	}

	return {
		players: [],
		allMatches: [],
		teamStats: [],
		lazy: {
			fantasyTeamPlayers: [],
			goals: [],
			clutches: []
		}
	};
}) satisfies PageServerLoad;
