import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	let { season } = await parent();

	// Todo make this as a function in supabase
	const { data: players, error: playersError } = await supabase
		.from('players_seasons')
		.select(
			`   
				players(
					name,
					image
				),
				player_id,
				season_id,
				attack,
				defence,
				physical,
				morale,
				price
			
			`
		)
		.eq('season_id', season?.id);

	// todo lol error
	if (playersError) {
		throw error(500, {
			message: playersError.message,
			devHelper: 'players/ fetch all players with stats'
		});
	}

	let mappedPlayers: FullPlayer[] = players.map((player) => {
		return {
			id: player.player_id,
			name: player.players?.name || 'placeholder',
			image: player.players?.image || 'placeholder.png',
			attack: player.attack,
			defence: player.defence,
			physical: player.physical,
			morale: player.morale,
			price: player.price
		};
	});

	return { mappedPlayers };
};
