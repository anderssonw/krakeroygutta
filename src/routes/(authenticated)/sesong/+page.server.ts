import type { PageServerLoad } from './$types';
import { fetchSeasonStatistics } from '$lib/queries';
import { defer, supabaseQuery } from '$lib/supabaseClient';
import { calculateFantasyTeamScore } from '$lib/scoring';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	const stats = defer(async () => {
		const { fullPlayerStats, teamStats } = await fetchSeasonStatistics(supabase, season);

		const fantasyTeamsData = await supabaseQuery(
			supabase.from('fantasy_teams').select('*, fantasy_teams_players(*)').eq('season_id', season.id)
		);

		if (!fantasyTeamsData) {
			return {
				teamStats,
				fantasyTeamStats: []
			};
		}

		const fantasyTeamStats: FantasyTeamStat[] = fantasyTeamsData.map((team) => {
			const playerIds = team.fantasy_teams_players.map((ftp) => ftp.player_id);
			const teamScore = calculateFantasyTeamScore(playerIds, team.captain_id, fullPlayerStats);

			return {
				id: team.id,
				name: team.name,
				score: teamScore
			};
		});

		return {
			teamStats,
			fantasyTeamStats
		};
	});

	return { stats };
}) satisfies PageServerLoad;
