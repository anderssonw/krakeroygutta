import { fail, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FullPlayer } from '$lib/types/newTypes';
import type { Tables } from '$lib/types/database.helper.types';

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
	default: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();

		const name = String(formData.get('name'));
		const currencyLeft = Number(formData.get('currencyLeft'));
		const captainId = Number(formData.get('captainId'));
		const playerIds = formData.getAll('playerIds').map((id) => parseInt(id.toString()));

		// TODO check currency, and add form validation

		const session = await getSession();
		if (session) {
			let todayTimeString = new Date().toDateString();

			const { data: season, error: seasonError } = await supabase
				.from('seasons')
				.select()
				.lt('start_time', todayTimeString)
				.gt('end_time', todayTimeString)
				.single();

			if (seasonError) {
				return fail(500, { message: 'There is no active season. Server could not handle your request.' });
			}

			// TODO change fantasy_team to use composite primary key, and change fantasy_teams_players to reference both. This way we don't have to
			// check if the team exists and then insert, and this upsert should work just fine
			const { data: fantasyTeam, error: fantasyTeamError } = await supabase
				.from('fantasy_team')
				.upsert({ name: name, season_id: season.id, captain_id: captainId, user_id: session.user.id }, { onConflict: 'season_id, user_id' })
				.select()
				.single();

			if (fantasyTeamError) {
				console.log(fantasyTeamError.message);
				return fail(500, { message: 'Something went wrong when updating/creating your fantasy team.' });
			}

			const { error: fantasyTeamsPlayersError } = await supabase.from('fantasy_teams_players').upsert(
				playerIds.map((id) => {
					return {
						fantasy_team_id: fantasyTeam.id,
						player_id: id
					};
				})
			);

			if (fantasyTeamsPlayersError) {
				console.log(fantasyTeamsPlayersError.message);
				return fail(500, { message: 'Something went wrong when updating/creating your fantasy team.' });
			}

			return { success: true };
		} else {
			return fail(401);
		}
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
