import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { Season, UserClient, UserDB } from '$lib/types/newTypes';

export const load: LayoutLoad<{
	session: Session | null;
	user: UserClient | null;
	activeSeason: Season | null;
}> = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let authUser = await supabaseClient.auth.getUser();

	let user: UserClient | null = null;
	let activeSeason: Season | null = null; // Central across several pages

	if (session) {
		// Update user
		const userQuery = await supabaseClient.from('users').select().eq('id', authUser.data.user?.id);
		if (userQuery.data != null) {
			let tempUser: UserDB = userQuery.data[0];
			user = {
				id: tempUser.id,
				email: authUser.data.user?.email ?? '',
				is_admin: tempUser.is_admin,
				is_superadmin: tempUser.is_superadmin
			};
		}

		// Update season
		const today: Date = new Date();
		const seasonsQuery = await supabaseClient
			.from('seasons')
			.select('*')
			.lt('start_time', today.toDateString())
			.gt('end_time', today.toDateString());
		if (seasonsQuery.data != null) {
			activeSeason = seasonsQuery.data[0];
		}
	}

	return { session, user, activeSeason };
};
