import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent, params }) => {
	let { season } = await parent();

	// Todo make this as a function in supabase
	const { data: player, error: playerError } = await supabase
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
		.eq('season_id', season?.id)
		.eq('player_id', params.slug)
		.single();

	// todo lol error
	if (playerError) {
		return {};
	}

	return {
		player: {
			id: player.player_id,
			name: player.players?.name || 'placeholder',
			image: player.players?.image || 'placeholder.png',
			attack: player.attack,
			defence: player.defence,
			physical: player.physical,
			morale: player.morale,
			price: player.price
		}
	};
};
