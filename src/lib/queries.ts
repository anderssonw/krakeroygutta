import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types/database.generated.types';
import type { Season } from './types/database-helpers';
import type { SeasonAndTeamPlayer } from './types/player';
import { defer, supabaseQuery } from './supabaseClient';

/**
 * Fetch all players for a given season with their team information
 */
export function fetchSeasonPlayersWithTeams(supabase: SupabaseClient<Database>, season: Season): Promise<SeasonAndTeamPlayer[]> {
	return defer<SeasonAndTeamPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*, team:teams_players(...teams(id, color, name)))').eq('season_id', season.id),
			'Error fetching players'
		);

		if (!players) {
			return [];
		}

		return players.map(
			(ps): SeasonAndTeamPlayer => ({
				id: ps.id,
				name: ps.name,
				image: ps.image,
				inform_image: ps.inform_image,
				outofform_image: ps.outofform_image,
				attack: ps.attack,
				defence: ps.defence,
				physical: ps.physical,
				skill: ps.skill,
				morale: ps.morale,
				price: ps.price,
				team: {
					id: ps.team[0].id,
					name: ps.team[0].name,
					color: ps.team[0].color
				}
			})
		);
	});
}
