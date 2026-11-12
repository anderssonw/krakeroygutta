import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchAllMatchesForSeason, fetchAllSeasons, fetchAllSeasonsPlayerWithTeam, fetchSeasonStatistics } from '$lib/queries';

export const load = (async ({ locals: { supabase }, parent, params }) => {
	const playerId = Number(params.id);

	if (!Number.isSafeInteger(playerId) || playerId < 1) {
		error(404, 'Spilleren finnes ikke');
	}

	const { season: currentSeason } = await parent();
	const [playerVersions, seasons] = await Promise.all([
		fetchAllSeasonsPlayerWithTeam(supabase, playerId),
		fetchAllSeasons(supabase)
	]);

	if (playerVersions.length === 0) {
		error(404, 'Spilleren finnes ikke');
	}

	const seasonStats = await Promise.all(
		playerVersions.map(async (playerVersion) => {
			const season = seasons.find((item) => item.id === playerVersion.season_id);

			if (!season) {
				error(500, `Fant ikke sesong ${playerVersion.season_id} for spiller ${playerId}`);
			}

			const [{ fullPlayerStats }, matches] = await Promise.all([
				fetchSeasonStatistics(supabase, season),
				fetchAllMatchesForSeason(supabase, season.id)
			]);
			const stats = fullPlayerStats.find((playerStats) => playerStats.id === playerId);
			const appearances = matches.filter(
				(match) =>
					match.home_team.players.some((player) => player.player_id === playerId) ||
					match.away_team.players.some((player) => player.player_id === playerId)
			).length;

			return {
				season_id: season.id,
				season_name: season.name,
				matches: appearances,
				wins: stats?.victories ?? 0,
				clean_sheets: stats?.cleanSheets ?? 0,
				goals: stats?.goals ?? 0,
				assists: stats?.assists ?? 0,
				clutches: stats?.clutches ?? 0
			};
		})
	);

	seasonStats.sort((a, b) => {
		const seasonA = seasons.find((season) => season.id === a.season_id);
		const seasonB = seasons.find((season) => season.id === b.season_id);
		return (seasonB?.start_time.getTime() ?? 0) - (seasonA?.start_time.getTime() ?? 0);
	});

	const previousSeason = seasons
		.filter((season) => season.start_time < currentSeason.start_time)
		.sort((a, b) => b.start_time.getTime() - a.start_time.getTime())[0];

	return {
		playerVersions,
		previousPlayer: previousSeason
			? (playerVersions.find((version) => version.season_id === previousSeason.id) ?? null)
			: null,
		seasonStats
	};
}) satisfies PageServerLoad;
