import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer, FullTeam, MatchWithTeams, PlayerMatchStats } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { session, season } = await parent();

	if (session) {
		if (!season) return {};

		const fetchFullTeams = async () => {
			const { data: fullTeams, error: fullTeamsError } = await supabase
				.from('team_with_players')
				.select(
					`
						*
					`
				)
				.eq('season_id', season?.id)
				.returns<FullTeam[]>();

			if (fullTeamsError) {
				throw error(500, {
					message: fullTeamsError.message,
					devHelper: '/teams fetching teams for a season'
				});
			}

			return fullTeams;
		}
		
		const fetchPlayersMatchStats = async () => {
			const { data: pms, error: pmsError } = await supabase
				.from('player_match_stats')
				.select(
					`
						*
					`
				)
				.eq('season_id', season?.id)
				.returns<PlayerMatchStats[]>();

			if (pmsError) {
				throw error(500, {
					message: pmsError.message,
					devHelper: '/player_match_stats fetching from player match stats view'
				});
			}

			return pms;
		}


		return { fullTeams: fetchFullTeams(), playerStats: fetchPlayersMatchStats() };
	}

	return { fullTeams: [], playerStats: [] };
};