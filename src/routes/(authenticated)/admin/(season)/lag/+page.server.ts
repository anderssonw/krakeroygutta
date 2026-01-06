import { supabaseQuery } from '$lib/supabaseClient';
import type { Team } from '$lib/types/database-helpers';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

type TeamWithPlayers = Team & {
	playerCount: number;
	players: { id: number; player_id: number; name: string; image: string }[];
};

type AdminTeamsLoad = {
	teams: TeamWithPlayers[];
	players: { player_id: number; name: string; image: string }[];
};

export const load = (async ({ locals: { supabase }, url }): Promise<AdminTeamsLoad> => {
	const seasonId = url.searchParams.get('seasonId');

	if (!seasonId) {
		return { teams: [], players: [] };
	}

	// Fetch teams for the season with their players
	const teams = await supabaseQuery(
		supabase.from('teams').select('*, teams_players(id, player_id, ...players(name, image))').eq('season_id', Number(seasonId)),
		'Error fetching teams'
	);

	const teamsWithPlayers: TeamWithPlayers[] =
		teams?.map((team) => ({
			...team,
			playerCount: Array.isArray(team.teams_players) ? team.teams_players.length : 0,
			players: Array.isArray(team.teams_players)
				? team.teams_players.map((tp: any) => ({
						id: tp.id,
						player_id: tp.player_id,
						name: tp.name,
						image: tp.image
					}))
				: []
		})) ?? [];

	// Fetch all players for the season
	const playersData = await supabaseQuery(
		supabase.from('players_seasons').select('player_id, ...players(name, image)').eq('season_id', Number(seasonId)),
		'Error fetching players'
	);

	const players =
		playersData?.map((p) => ({
			player_id: p.player_id,
			name: p.name,
			image: p.image
		})) ?? [];

	return {
		teams: teamsWithPlayers,
		players
	};
}) satisfies PageServerLoad;

export const actions = {
	createTeam: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const color = formData.get('color')?.toString();
		const seasonId = Number(formData.get('seasonId'));

		if (!name || !color || !seasonId) {
			return fail(400, { message: 'Missing required fields' });
		}

		const { error } = await supabase.from('teams').insert({
			name,
			color,
			season_id: seasonId
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Lag opprettet' };
	},

	addPlayerToTeam: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const teamId = Number(formData.get('teamId'));
		const playerId = Number(formData.get('playerId'));

		if (!teamId || !playerId) {
			return fail(400, { message: 'Missing required fields' });
		}

		// Check if player is already on a team this season
		const team = (await supabaseQuery(supabase.from('teams').select('season_id').eq('id', teamId).single(), 'Error fetching team')) as {
			season_id: number;
		} | null;

		if (!team) {
			return fail(404, { message: 'Team not found' });
		}

		// Check if player is on any team in this season
		const teamsInSeason = await supabaseQuery(
			supabase.from('teams').select('id').eq('season_id', team.season_id),
			'Error fetching teams in season'
		);

		if (!teamsInSeason || teamsInSeason.length === 0) {
			return fail(500, { message: 'Error checking season teams' });
		}

		const teamIds = teamsInSeason.map((t) => t.id);

		const existingAssignment = await supabaseQuery(
			supabase.from('teams_players').select('id').eq('player_id', playerId).in('team_id', teamIds),
			'Error checking existing team assignment'
		);

		if (existingAssignment && existingAssignment.length > 0) {
			return fail(400, { message: 'Spiller er allerede på et lag denne sesongen' });
		}

		const { error } = await supabase.from('teams_players').insert({
			team_id: teamId,
			player_id: playerId
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Spiller lagt til lag' };
	},

	removePlayerFromTeam: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const teamPlayerId = Number(formData.get('teamPlayerId'));

		if (!teamPlayerId) {
			return fail(400, { message: 'Missing required fields' });
		}

		const { error } = await supabase.from('teams_players').delete().eq('id', teamPlayerId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Spiller fjernet fra lag' };
	},

	deleteTeam: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const teamId = Number(formData.get('teamId'));

		if (!teamId) {
			return fail(400, { message: 'Missing required fields' });
		}

		const { error } = await supabase.from('teams').delete().eq('id', teamId);

		if (error) {
			return fail(400, { message: error.message });
		}

		return { success: true, message: 'Lag slettet' };
	}
};
