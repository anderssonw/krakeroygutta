import { fail, type Actions, error, redirect } from '@sveltejs/kit';
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

	if (playersError) {
		throw error(500, {
			message: playersError.message,
			devHelper: '/fantasy getting players with stats'
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

	if (fantasyError) {
		throw error(500, {
			message: fantasyError.message,
			devHelper: '/fantasy getting fantasy team for user'
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
		throw error(500, {
			message: fantasyTeamPlayersError.message,
			devHelper: '/fantasy getting fantasy team players'
		});
	}

	let mappedFantasyPlayers: FullPlayer[] = [];

	if (fantasyTeamPlayers && fantasyTeamPlayers.length > 0) {
		mappedFantasyPlayers = fantasyTeamPlayers.map((player) => mapPlayer(player));
	}

	return { fantasyTeam: fantasy, fantasyTeamPlayers: mappedFantasyPlayers, allPlayers: mappedPlayers, user: user };
};

export const actions = {
	default: async ({ request, locals: { supabase, getSession, getSeason } }) => {
		const formData = await request.formData();

		const name = String(formData.get('teamName'));
		const currencyLeft = Number(formData.get('currencyLeft'));
		const captainId = Number(formData.get('captainId'));
		const playerIds = formData.getAll('playerIds').map((id) => parseInt(id.toString()));

		console.log(captainId);
		console.log(playerIds);

		let formHints: string[] = [];
		let formIsValid: boolean = true;

		if (!name || typeof name !== 'string') {
			formHints.push('Lagnavn er påkrevn');
			formIsValid = false;
		}
		if(playerIds.length > 0 && captainId < 0) {
			formHints.push('Du må velge kaptein');
			formIsValid = false;
		}

		const session = await getSession();
		const season = await getSeason();

		if (session && season) {
			// Dette er egentlig en shitty måte å sjekke penger på, du kan sende inn hva som helst som currency left, burde kalkuleres ut i fra spillere
			// men sjansen for at folk prøver å hacke backenden??? nåvel
			if (season.starting_currency + currencyLeft < season.starting_currency) {
				formHints.push(`Du kan ikke bruke mer enn ${season.starting_currency} penger`);
				formIsValid = false;
			}

			if (!formIsValid) {
				return fail(400, {
					formHints
				});
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
				throw error(500, {
					message: fantasyTeamError.message,
					devHelper: '/fantasy fetching current fantasy team'
				});
			}

			let fantasyTeamId = -1;

			if (currentFantasyTeam && currentFantasyTeam.id) {
				const { error: updateError } = await supabase.from('fantasy_teams').update(fantasyTeamToInsert).eq('id', currentFantasyTeam.id);

				if (updateError) {
					throw error(500, {
						message: updateError.message,
						devHelper: '/fantasy updating current fantasy team'
					});
				}

				fantasyTeamId = currentFantasyTeam.id;
			} else {
				const { data: newFantasyTeam, error: insertError } = await supabase
					.from('fantasy_teams')
					.insert(fantasyTeamToInsert)
					.select('id')
					.single();

				if (insertError) {
					throw error(500, {
						message: insertError.message,
						devHelper: '/fantasy inserting current fantasy team'
					});
				}


				if (!insertError) fantasyTeamId = newFantasyTeam.id;
			}

			const { error: deleteCurrentTeamError } = await supabase.from('fantasy_teams_players').delete().eq('fantasy_team_id', fantasyTeamId);

			if (deleteCurrentTeamError) {
				throw error(500, {
					message: deleteCurrentTeamError.message,
					devHelper: '/fantasy deleting fantasy team players'
				});
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
				throw error(500, {
					message: fantasyTeamsPlayersError.message,
					devHelper: '/fantasy inserting/updating fantasy team players'
				});
			}
		} 

		throw redirect(303, '/fantasy');
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
