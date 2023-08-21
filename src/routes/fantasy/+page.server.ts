import { fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	// Get layout info
	const { user, season, session } = await parent();

	// Todo make this as a function in supabase
	const { data: players, error: playersError } = await supabase
		.from('players')
		.select(
			`   
				id,
				name,
				image,
				players_seasons(
					attack,
					defence,
					physical,
					morale,
					price	
				)
			`
		)
		.eq('players_seasons.season_id', season?.id);

	// todo lol error
	if (playersError) {
		throw error(500, {
			message: playersError.message
		});
	}

	let mappedPlayers: FullPlayer[] = players.map((player) => mapPlayer(player));

	// Get fantasy info
	const { data: fantasy, error: fantasyError } = await supabase
		.from('fantasy_team')
		.select()
		.eq('user_id', session?.user.id)
		.eq('season_id', season?.id)
		.maybeSingle();

	// todo lol error
	if (fantasyError) {
		throw error(500, {
			message: fantasyError.message
		});
	}

	const { data: fantasyTeamPlayers, error: fantasyTeamPlayersError } = await supabase
		.from('players')
		.select(
			`
				*,
				fantasy_teams_players!inner(id),
				players_seasons(
					attack,
					defence,
					physical,
					morale,
					price
				)
			`
		)
		.eq('fantasy_teams_players.fantasy_team_id', fantasy?.id);

	if (fantasyTeamPlayersError) {
		throw error(500, {
			message: fantasyTeamPlayersError.message
		});
	}

	let mappedFantasyPlayers: FullPlayer[] = [];

	if (fantasyTeamPlayers && fantasyTeamPlayers.length > 0) {
		mappedFantasyPlayers = fantasyTeamPlayers.map((player) => mapPlayer(player));
	}

	return { fantasyTeam: fantasy, fantasyTeamPlayers: mappedFantasyPlayers, allPlayers: mappedPlayers, user: user };
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

const mapPlayer = (player: { players_seasons: any[]; id: number; name: string; image: string }) => {
	let playerStats = player.players_seasons[0];
	return {
		id: player.id,
		name: player.name,
		image: player.image,
		attack: playerStats.attack,
		defence: playerStats.defence,
		physical: playerStats.physical,
		morale: playerStats.morale,
		price: playerStats.price
	};
};
