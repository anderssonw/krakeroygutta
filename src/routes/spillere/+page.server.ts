import { supabaseQuery, defer } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';
import type { PlayerInfo } from './types';

export const load = (async ({ locals: { supabase }, parent }) => {
	const { season } = await parent();

	if (!season) {
		return { players: [] };
	}

	const players: Promise<PlayerInfo[]> = defer(async () => {
		const players = await supabaseQuery(
			supabase.from('players_seasons').select('*, ...players(*, team:teams_players(...teams(id, color, name)))').eq('season_id', season.id),
			'Error fetching players'
		);

		if (!players) {
			return [];
		}

		return players.map((ps) => {
			return {
				id: ps.id,
				name: ps.name,
				image: ps.image,
				inform_image: ps.inform_image,
				outofform_image: ps.outofform_image,
				attack: ps.attack,
				defence: ps.defence,
				physical: ps.physical,
				skill: ps.skill,
				morale: ps.morale,
				price: ps.price,
				team: {
					id: ps.team[0].id,
					name: ps.team[0].name,
					color: ps.team[0].color
				}
			} satisfies PlayerInfo;
		});
	});

	return { players };
}) satisfies PageServerLoad;
