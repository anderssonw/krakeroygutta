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
				},
				season_id: ps.season_id
			})
		);
	});
}

/**
 * Fetch a player for a given season with their team information
 */
export function fetchAllSeasonsPlayerWithTeam(supabase: SupabaseClient<Database>, playerId: number): Promise<SeasonAndTeamPlayer[]> {
	return defer<SeasonAndTeamPlayer[]>(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*, team:teams_players(...teams(*)))').eq('player_id', playerId),
			'Error fetching player'
		);

		if (!players) {
			return [];
		}

		return players.map((ps): SeasonAndTeamPlayer => {
			const team = ps.team.find((t) => t.season_id === ps.season_id);

			if (!team) {
				throw new Error(`No team found for player season with season_id ${ps.season_id}`);
			}
			return {
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
					id: team.id,
					name: team.name,
					color: team.color
				},
				season_id: ps.season_id
			};
		});
	});
}

export function fetchAllSeasons(supabase: SupabaseClient<Database>): Promise<Season[]> {
	return defer<Season[]>(async () => {
		const seasons = await supabaseQuery(
			supabase.from('seasons').select('*').order('start_time', { ascending: false }),
			'Error fetching seasons'
		);

		if (!seasons) {
			return [];
		}

		return seasons.map((season) => ({
			...season,
			start_time: new Date(season.start_time),
			end_time: new Date(season.end_time),
			deadline_time: new Date(season.deadline_time)
		}));
	});
}
