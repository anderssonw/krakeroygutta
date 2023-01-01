import type { Database } from '$lib/types/database.types';
import * as db from '$lib/supabase';
import type { Player } from '$lib/types/Player';
import type { Actions, PageServerLoad } from './$types';
import type { FantasyTeam } from '$lib/types/FantasyTeam';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad<{ players: Player[] } | { players: undefined }> = async () => {
	const data = (await db.supabase.from('players').select()).data;
	let players: Player[] = [];

	if (data == null) {
		return {};
	}

	data.map((d: Database['public']['Tables']['players']['Row']) =>
		players.push({
			id: d.id,
			createdAt: d.created_at,
			playerName: d.player_name,
			price: d.price
		})
	);

	return { players };
};

/** @type {import('./$types').Actions} */
export const actions: Actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		const data: FantasyTeam = {
			name: formData.get('name') as string,
			captainId: Number(formData.get('captain') as string),
			playerIds: [
				Number(formData.get('player-0') as string),
				Number(formData.get('player-1') as string),
				Number(formData.get('player-2') as string),
				Number(formData.get('player-3') as string)
			]
		};

		if (!data.name) {
			return fail(400, { data, missingName: true });
		}

		if (!data.captainId) {
			return fail(400, { data, missingCaptain: true });
		}

		if (data.playerIds.some((playerId) => playerId == 0)) {
			return fail(400, { data, missingPlayers: true });
		}

		const teamToDBFormat: Database['public']['Tables']['fantasy_teams']['Insert'] = {
			name: data.name,
			captain_id: data.captainId,
			player_ids: data.playerIds.sort()
		};

		const insert = await db.supabase.from('fantasy_teams').insert(teamToDBFormat);

		if (insert.error) {
			console.log(insert.error);
			return fail(500, { data, serverError: true });
		}

		return { success: true, data };
	}
};
