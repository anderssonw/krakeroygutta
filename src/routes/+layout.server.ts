import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

// Since docs only gets session in server layout, rest in client layout
// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit

export const load: LayoutServerLoad<{ session: Session | null }> = async (event) => {
	let session = await getServerSession(event);
	return { session };
};
