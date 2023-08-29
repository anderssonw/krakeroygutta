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
		.from('fantasy_teams')
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

	if (!fantasy) {
		return { fantasyTeam: null, fantasyTeamPlayers: null, allPlayers: mappedPlayers, user: user };
	}

	const { data: fantasyTeamPlayers, error: fantasyTeamPlayersError } = await supabase
		.from('players')
		.select(
			`
				*,
				fantasy_teams_players!inner(player_id),
				players_seasons(
					attack,
					defence,
					physical,
					morale,
					price
				)
			`
		)
		.eq('fantasy_teams_players.fantasy_team_id', fantasy.id);

	if (fantasyTeamPlayersError) {
		console.log('fantasyteamplerserror', fantasyTeamPlayersError);
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

		// gather errors
		const errors: Record<string, string> = {};

		if (!name || typeof name !== 'string') {
			errors.name = 'Lagnavn er påkrevd';

			return fail(400, { data: Object.fromEntries(formData), errors });
		}

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

			// Dette er egentlig en shitty måte å sjekke penger på, du kan sende inn hva som helst som currency left, burde kalkuleres ut i fra spillere
			// men sjansen for at folk prøver å hacke backenden??? nåvel
			if (season.starting_currency + currencyLeft < season.starting_currency) {
				errors.currency = `Du kan ikke bruke mer enn ${season.starting_currency} penger`;

				return fail(400, { data: Object.fromEntries(formData), errors });
			}

			let fantasyTeamToInsert = {
				name: name,
				season_id: season.id,
				captain_id: captainId > 0 ? captainId : null,
				user_id: session.user.id
			};

			let { data: currentFantasyTeam, error: fantasyTeamError } = await supabase
				.from('fantasy_teams')
				.select('*')
				.eq('season_id', season.id)
				.eq('user_id', session.user.id)
				.maybeSingle();

			if (fantasyTeamError) {
				console.log('GetFantasyTeamError', fantasyTeamError.message);
				return fail(500, { message: 'Something went wrong when updating/creating your fantasy team.' });
			}

			let fantasyTeamId = -1;

			if (currentFantasyTeam && currentFantasyTeam.id) {
				const { error: updateError } = await supabase.from('fantasy_teams').update(fantasyTeamToInsert).eq('id', currentFantasyTeam.id);

				fantasyTeamError = updateError;

				fantasyTeamId = currentFantasyTeam.id;
			} else {
				const { data: newFantasyTeam, error: insertError } = await supabase
					.from('fantasy_teams')
					.insert(fantasyTeamToInsert)
					.select('id')
					.single();

				fantasyTeamError = insertError;

				if (!insertError) fantasyTeamId = newFantasyTeam.id;
			}

			if (fantasyTeamError) {
				console.log('InsertFantasyTeamError', fantasyTeamError.message);
				return fail(500, { message: 'Something went wrong when updating/creating your fantasy team.' });
			}

			const { error: deleteCurrentTeamError } = await supabase.from('fantasy_teams_players').delete().eq('fantasy_team_id', fantasyTeamId);

			if (deleteCurrentTeamError) {
				console.log('delete', deleteCurrentTeamError.message);
				return fail(500, { message: 'Something went wrong when updating/creating your fantasy team.' });
			}

			const { error: fantasyTeamsPlayersError } = await supabase.from('fantasy_teams_players').upsert(
				playerIds.map((id) => {
					return {
						fantasy_team_id: fantasyTeamId,
						player_id: id
					};
				})
			);

			if (fantasyTeamsPlayersError) {
				console.log('playerserror', fantasyTeamsPlayersError.message);
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
