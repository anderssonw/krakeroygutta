import type { LayoutLoad } from './$types';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database.generated.types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
		supabaseKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session, user: data.user, season: data.season };
};
