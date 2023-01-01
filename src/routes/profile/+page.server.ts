// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async () => {
// 	const data = (await db.supabase.from('players').select()).data;
// 	let players: Player[] = [];

// 	if (data == null) {
// 		return {};
// 	}

// 	data.map((d: Database['public']['Tables']['players']['Row']) =>
// 		players.push({
// 			id: d.id,
// 			createdAt: d.created_at,
// 			playerName: d.player_name,
// 			price: d.price
// 		})
// 	);

// 	return { players };
// };
