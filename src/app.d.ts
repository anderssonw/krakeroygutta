import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.generated.types';
import type { Profile, Season } from '$lib/types/database-helpers';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{
				session: Session | null;
				user: Session['user'] | null;
				profile: Profile | null;
			}>;
			season(): Promise<Season | null>;
		}
		interface PageData {
			session: Session | null;
			user?: Session['user'] | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}
export {};
