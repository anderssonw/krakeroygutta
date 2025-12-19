import type { PageServerLoad } from './$types';
import { fetchSeasonStatistics } from '$lib/queries';
import { defer, supabaseQuery } from '$lib/supabaseClient';

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
			const captain = team.captain_id;

			const teamScore = team.fantasy_teams_players.reduce((acc, ftp) => {
				const playerStat = fullPlayerStats.find((ps) => ps.id === ftp.player_id);

				return acc + (playerStat ? (playerStat.id === captain ? playerStat.totalScore * 2 : playerStat.totalScore) : 0);
			}, 0);

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
