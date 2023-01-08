import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Database } from '$lib/types/database.types';

export const load: LayoutServerLoad = async (event) => {
	let session = await getServerSession(event);

	if (session) {
		const { supabaseClient } = await getSupabase(event);

		const userQuery = await supabaseClient.from('users').select();

		console.log(userQuery);
		if (userQuery.data != null) {
			console.log(userQuery.data);
		}
	}

	return { session };
};
