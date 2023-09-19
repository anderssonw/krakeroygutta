// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '$lib/types/database.generated.types';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.helper.types';
import 'unplugin-icons/types/svelte';

// and what to do when importing types
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			getUser(): Promise<Tables<'users'> | null>;
			getSeason(): Promise<Tables<'seasons'> | null>;
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
