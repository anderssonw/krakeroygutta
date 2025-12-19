import type { PageServerLoad } from './$types';
import { fetchSeasonPlayersWithTeams } from '$lib/queries';
import { defer } from '$lib/supabaseClient';
import type { SeasonAndTeamPlayer } from '$lib/types/player';

type TeamWithPlayers = {
	id: number;
	name: string;
	color: string;
	players: SeasonAndTeamPlayer[];
};

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	if (!season) {
		return { teams: [] };
	}

	const teams = defer<TeamWithPlayers[]>(async () => {
		const players = await fetchSeasonPlayersWithTeams(supabase, season);

		if (!players || players.length === 0) {
			return [];
		}

		// Group players by team
		const teamMap = new Map<number, TeamWithPlayers>();

		for (const player of players) {
			if (!teamMap.has(player.team.id)) {
				teamMap.set(player.team.id, {
					id: player.team.id,
					name: player.team.name,
					color: player.team.color,
					players: []
				});
			}
			teamMap.get(player.team.id)!.players.push(player);
		}

		// Convert to array and sort by team name
		return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'nb-NO'));
	});

	return { teams };
}) satisfies PageServerLoad;
