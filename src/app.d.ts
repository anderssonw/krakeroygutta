// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/types/database.generated.types';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.helper.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			getUser(): User | null;
			user: User | null;
			getSeason(): Promise<Tables<'seasons'> | null>;
			getGuttaUser(): Promise<Tables<'users'> | null>;
			guttaUser: Tables<'users'> | null;
		}
		interface PageData {
			session: Session | null;
		}
		interface Error {
			devHelper?: string;
		}
	}
	// interface PageData {}
	// interface Platform {}
}

export {};
