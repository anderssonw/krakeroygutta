import type { Season, UserClient, UserDB } from '$lib/types/newTypes';
import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';


export const load: LayoutServerLoad<{ session: Session | null; user: UserClient | null; activeSeason: Season; }> = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);

	let authUser = await supabaseClient.auth.getUser();

	let user: UserClient | null = null;
	let activeSeason: Season = {} as Season; // Central across several pages

	if (session) {
		// Update user
		const userQuery = await supabaseClient.from('users').select().eq("uid", authUser.data.user?.id);
		if (userQuery.data != null) {
			let tempUser: UserDB = userQuery.data[0];
			user = {
				uid: tempUser.uid,
				email: authUser.data.user?.email ?? "",
				is_admin: tempUser.is_admin
			};
		}

		// Update season
		
        const seasonsQuery = await supabaseClient.from('seasons').select();
        const today: Date = new Date();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);

                // Today is between start and end of the season => ongoing season
                if (today > seasonStart && today < seasonEnd) {
                    activeSeason = d;
                }
            });
        }
		
	}

	return { session, user, activeSeason };
};
