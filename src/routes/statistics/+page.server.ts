import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { MatchStatsTeam, MatchWithSeasonName, StandardPlayer } from '$lib/types/newTypes';

export const load = (async ({ locals: { supabase }, url }) => {
	const getFantasyTeamPlayersForSeason = async () => {
		const { data: players, error: playersError } = await supabase.from('fantasy_teams').select(
			`
				id,
                season_id,
				players:fantasy_teams_players(player_id)
				`
		);

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/statistics getting players'
			});
		}

		return players;
	};

	const getSeasons = async () => {
		let todayDate = new Date().toLocaleString();

		const { data: seasons, error: seasonsError } = await supabase.from('seasons').select().lt('deadline_time', todayDate);

		if (seasonsError) {
			error(500, {
				message: seasonsError.message,
				devHelper: '/statistics getting seasons'
			});
		}

		return seasons;
	};

	const getPlayers = async () => {
		const { data: players, error: playersError } = await supabase.from('players').select('*').returns<StandardPlayer[]>();

		if (playersError) {
			error(500, {
				message: playersError.message,
				devHelper: '/statistics getting matches'
			});
		}

		return players;
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
			error(500, {
				message: matchesError.message,
				devHelper: '/statistics getting matches'
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
			error(500, {
				message: teamStatsError.message,
				devHelper: '/team_with_stats getting team with player stats - view'
			});
		}

		return teamStats;
	};

	return {
		seasons: await getSeasons(),
		players: await getPlayers(),
		allMatches: await getMatchesForSeason(),
		teamStats: await getTeamStatsSeason(),
		fantasyTeamPlayers: await getFantasyTeamPlayersForSeason()
	};
}) satisfies PageServerLoad;
