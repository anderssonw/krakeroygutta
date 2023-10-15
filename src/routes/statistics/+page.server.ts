import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/types/database.helper.types';

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
			throw error(500, {
				message: playersError.message,
				devHelper: '/statistics getting players'
			});
		}

		return players;
	};

	const getPlayers = async () => {
		const { data: players, error: playersError } = await supabase.from('players').select();

		if (playersError) {
			throw error(500, {
				message: playersError.message,
				devHelper: '/statistics getting matches'
			});
		}

		return players;
	};

	const getMatchesForSeason = async (seasonId: number) => {
		const { data: matches, error: matchesError } = await supabase.from('matches').select().eq('season_id', seasonId);

		if (matchesError) {
			throw error(500, {
				message: matchesError.message,
				devHelper: '/statistics getting matches'
			});
		}

		return matches;
	};

	const getGoals = async (matchIds: number[]) => {
		const { data: goals, error: goalsError } = await supabase.from('goals').select().in('match_id', matchIds);

		if (goalsError) {
			throw error(500, {
				message: goalsError.message,
				devHelper: '/statistics getting goals'
			});
		}

		return goals;
	};

	const getClutches = async (matchIds: number[]) => {
		const { data: clutches, error: clutchesError } = await supabase.from('clutches').select().in('match_id', matchIds);

		if (clutchesError) {
			throw error(500, {
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
			players: getPlayers(),
			lazy: {
				fantasyTeamPlayers: getFantasyTeamPlayersForSeason(seasonId),
				goals: getGoals(matches.map((match) => match.id)),
				clutches: getClutches(matches.map((match) => match.id))
			}
		};
	}

	return {
		players: [],
		lazy: {
			fantasyTeamPlayers: [],
			goals: [],
			clutches: []
		}
	};
}) satisfies PageServerLoad;
