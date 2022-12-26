import type { Database } from '$lib/types/database.types';
import * as db from '$lib/supabase';
import type { Player } from '$lib/types/Player';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ data: Player[] } | { data: undefined }> = async () => {
	const data = (await db.supabase.from('players').select()).data;
	let tempPlayers: Player[] = [];
	if (data !== null) {
		data.map((d: Database['public']['Tables']['players']['Row']) =>
			tempPlayers.push({
				id: d.id,
				createdAt: d.created_at,
				playerName: d.player_name,
				price: d.price
			})
		);
		return { data: tempPlayers };
	}

	return {};
};
