// src/hooks.server.ts
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
		supabaseKey: NEXT_PUBLIC_SUPABASE_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		session?.user;
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
