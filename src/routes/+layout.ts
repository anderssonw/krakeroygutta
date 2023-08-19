import type { LayoutLoad } from './$types';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { Database } from '$lib/types/database.generated.types';
import type { Tables } from '$lib/types/database.helper.types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
		supabaseKey: import.meta.env.VITE_PUBLIC_SUPABASE_KEY,
		event: { fetch },
		serverSession: data.session
	});

	let user: Tables<'users'> | null = null;

	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session) {
		const userQuery = await supabase.from('users').select();

		if (userQuery.data != null) {
			user = userQuery.data[0];
		}
	}

	return { supabase, session, user };
};
