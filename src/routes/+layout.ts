import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import type { User } from '$lib/types/newTypes';
import userJson from '$lib/dummydata/user.json';

export const load: LayoutLoad<{ session: Session | null; user: User | null }> = async (event) => {
	const { session } = await getSupabase(event);

	let user: User | null = null;

	const dbUser: User = userJson; // Change with fetch from database
	user = dbUser;
	
	/*
	if (session) {
		const { supabaseClient } = await getSupabase(event);

		const userQuery = await supabaseClient.from('users').select();

		if (userQuery.data != null) {
			let tempUser: Database['public']['Tables']['users']['Row'] = userQuery.data[0];
			user = {
				id: tempUser.id,
				isAdmin: tempUser.is_admin,
				username: tempUser.username
			};
		}
	}
	*/

	return { session, user };
};
