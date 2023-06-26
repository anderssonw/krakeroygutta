import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { User, UserDB } from '$lib/types/newTypes';

export const load: LayoutLoad<{ session: Session | null; user: User | null }> = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let authUser = await supabaseClient.auth.getUser();

	let user: User | null = null;
	
	if (session) {
		const userQuery = await supabaseClient.from('users').select().eq("id", authUser.data.user?.id);

		if (userQuery.data != null) {
			let tempUser: UserDB = userQuery.data[0];
			console.log(tempUser);
			user = {
				email: authUser.data.user?.email ?? "",
				username: tempUser.username,
				is_admin: tempUser.is_admin,
				cash: tempUser.cash,
				players: tempUser.players.split(",").map(Number),
				captain: tempUser.captain
			};
		}
	}

	return { session, user };
};
