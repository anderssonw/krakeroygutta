import { Tables } from '$lib/types/database.helper.types.js';
import { error } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request, params }) {
	const playersToUpdate = (await request.json()) as Tables<'players_seasons'>[];

	const { data: players, error: getErr } = await supabase.from('players_seasons').select().eq('season_id', params.id);
	const { error: upsertErr } = await supabase.from('players_seasons').upsert(playersToUpdate);

	if (getErr || upsertErr) {
		error(500, 'Noe gikk galt');
	}

	const playersToDelete =
		players
			?.filter((player) => playersToUpdate.find((playerToFind) => player.player_id == playerToFind.player_id) == null)
			.map((player) => player.player_id) || [];

	const { error: deleteErr } = await supabase
		.from('players_seasons')
		.delete()
		.in('player_id', [playersToDelete])
		.eq('season_id', params.id);

	if (deleteErr) {
		console.log(deleteErr);
		error(500, 'Noe gikk galt');
	}

	return new Response();
}
