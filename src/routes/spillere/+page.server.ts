import { supabaseQuery, defer } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { currentSeason } = await parent();

	if (!currentSeason) {
		return { players: [] };
	}

	const players = defer(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*)').eq('season_id', currentSeason.id),
			'Error fetching players'
		);

		if (!players) {
			return [];
		}

		return players;
	});

	return { players };
}) satisfies PageServerLoad;
