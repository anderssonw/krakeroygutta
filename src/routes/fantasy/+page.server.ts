import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	// Get layout info
	const { user, season, session } = await parent();

	console.log(season);

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
		console.log('error in players, ', playersError);
		return { fantasy: null, players: [], season: season, user: user };
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

	// Get fantasy info
	const { data: fantasy, error: fantasyError } = await supabase
		.from('fantasy_team')
		.select()
		.eq('user_id', session?.user.id)
		.eq('season_id', season?.id)
		.maybeSingle();

	// todo lol error
	if (fantasyError) {
		console.log('fantasyError: ', fantasyError);
		return { fantasy: null, players: mappedPlayers, season: season, user: user };
	}

	console.log(fantasy);

	const { data: fantasyTeamPlayers, error: fantasyTeamPlayersError } = await supabase
		.from('fantasy_teams_players')
		.select('*, players(*), players_seaons(*)'); //, players_stats(attack, defence, physical, morale, price)
	//.eq('fantasy_team_id', fantasy?.id);

	console.log(fantasyTeamPlayers);

	// todo lol error
	if (fantasyTeamPlayersError) {
		console.log('fantasyTeamPlayersError: ', fantasyTeamPlayersError);
		return { fantasy: null, players: mappedPlayers, season: season, user: user };
	}

	return { fantasy: fantasy, players: mappedPlayers, season: season, user: user };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const teamName = formData.get('teamName')?.toString();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (email && password) {
			const { error: error } = await supabase.auth.signUp({
				email,
				password
			});

			if (error) {
				return fail(500, {
					supabaseErrorMessage: error.message
				});
			}
		}

		return fail(400);
	}
} satisfies Actions;
