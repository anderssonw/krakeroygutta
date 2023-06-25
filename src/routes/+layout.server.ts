import type { User } from '$lib/types/newTypes';
import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import userJson from '$lib/dummydata/user.json';

// Since docs only gets session in server layout, rest in client layout
// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit

export const load: LayoutServerLoad<{ session: Session | null; user: User | null }> = async (event) => {
	let session = await getServerSession(event);

	let user: User | null = null;

	const dbUser: User = userJson; // Change with fetch from database
	user = dbUser;

	return { session, user };
};
