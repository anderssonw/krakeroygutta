import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { User } from '$lib/types/User';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

export const load: LayoutLoad<{ session: Session | null; user: User | null }> = async (event) => {
	const { session } = await getSupabase(event);

	let user: User | null = null;

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

	return { session, user };
};
