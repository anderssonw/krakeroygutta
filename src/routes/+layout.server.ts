import type { User, UserDB } from '$lib/types/newTypes';
import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';


export const load: LayoutServerLoad<{ session: Session | null; user: User | null }> = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);

	let authUser = await supabaseClient.auth.getUser();

	let user: User | null = null;

	if (session) {
		const { supabaseClient } = await getSupabase(event);
		const userQuery = await supabaseClient.from('users').select().eq("id", authUser.data.user?.id);

		if (userQuery.data != null) {
			let tempUser: UserDB = userQuery.data[0];
			user = {
				email: authUser.data.user?.email ?? "",
				username: tempUser.username,
				is_admin: tempUser.is_admin,
				cash: tempUser.cash
			};
		}
	}

	return { session, user };
};
