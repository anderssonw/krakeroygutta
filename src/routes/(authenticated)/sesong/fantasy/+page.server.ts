import { supabaseQuery } from '$lib/supabaseClient';
import type { SeasonAndTeamPlayer } from '$lib/types/player';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Season } from '$lib/types/database-helpers';
import { fetchSeasonPlayersWithTeams } from '$lib/queries';
import { fantasyTeamFormSchema } from './validation';

type FantasyLoadData = {
	season: Season | null;
	fantasyTeam: FantasyTeam | null;
	players: Promise<SeasonAndTeamPlayer[]>;
};

// Forslag for at man alltid har riktig type return
export const load = (async ({ locals: { supabase }, parent }): Promise<FantasyLoadData> => {
	const { profile, season } = await parent();

	if (!season) {
		return {
			season: null,
			fantasyTeam: null,
			players: Promise.resolve<SeasonAndTeamPlayer[]>([])
		};
	}

	const fantasyData = await supabaseQuery(
		supabase
			.from('fantasy_teams')
			.select('*, players:fantasy_teams_players(player_id)')
			.eq('season_id', season.id)
			.eq('user_id', profile.id)
	);

	const fantasyTeam = (() => {
		if (!fantasyData || fantasyData.length === 0) return null;

		if (fantasyData.length > 1) {
			error(500, 'Error fetching fantasy team, multiple teams found for user');
		}

		const team = fantasyData[0];
		return {
			id: team.id,
			name: team.name,
			captainPlayerId: team.captain_id,
			playersIds: team.players.map((p) => p.player_id)
		};
	})();

	const players = fetchSeasonPlayersWithTeams(supabase, season);

	return {
		season,
		fantasyTeam,
		players
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { supabase, getSeason, safeGetSession } }) => {
		const result = fantasyTeamFormSchema.safeParse(await request.formData());

		if (result.error) {
			return fail(400, { errors: result.error.message });
		}

		const season = await getSeason();
		if (!season) {
			return fail(500, { errors: 'Ingen aktiv sesong, dette skal ikke skje' });
		}
		const { profile } = await safeGetSession();
		if (!profile) {
			return fail(401, { errors: 'Du må være logget inn for å lagre laget ditt' });
		}

		const { teamId, teamName, playerIds, captainId } = result.data;

		// Alt nedover her er litt bob-bob. Det er litt kjipt å ikke ha transaksjoner. Vi burde egentlig ikke gjøre noen av disse operasjonene hvis én av de feiler.
		// Kanskje en idé å lage en edge-funksjon i supabase som tar seg av hele operasjonen?
		const upsertTeamResult = await supabaseQuery(
			supabase
				.from('fantasy_teams')
				.upsert({
					id: teamId ?? undefined,
					user_id: profile.id,
					season_id: season.id,
					name: teamName,
					captain_id: captainId
				})
				.select()
		);

		if (!upsertTeamResult) {
			return fail(500, { errors: 'Kunne ikke lagre laget ditt, prøv igjen senere' });
		}

		const fantasyTeamId = upsertTeamResult[0].id;

		// Delete existing players - check for errors
		const deleteResult = await supabase.from('fantasy_teams_players').delete().eq('fantasy_team_id', fantasyTeamId);

		if (deleteResult === null) {
			return fail(500, { errors: 'Kunne ikke oppdatere laget ditt, prøv igjen senere' });
		}

		// Insert new players
		const playersToInsert = playerIds.map((playerId) => ({
			fantasy_team_id: fantasyTeamId,
			player_id: playerId
		}));

		const insertResult = await supabase.from('fantasy_teams_players').insert(playersToInsert);

		if (insertResult === null) {
			return fail(500, { errors: 'Kunne ikke lagre spillerne dine, prøv igjen senere' });
		}

		return {
			success: true,
			message: 'Laget ditt ble lagret!'
		};
	}
};
