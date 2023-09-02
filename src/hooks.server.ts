// src/hooks.server.ts
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Tables } from '$lib/types/database.helper.types';
import type { PostgrestError } from '@supabase/supabase-js';

const loggedInRoutes = ['fantasy', 'players', 'profile', 'teams'];

const adminRoutes = ['admin'];

const isLoggedInRoute = (pathname: string): boolean => {
	if (pathname.length == 0) return false;

	let firstPath = pathname.split('/')[1];

	return loggedInRoutes.includes(firstPath);
};

const isAdminRoute = (pathname: string): boolean => {
	if (pathname.length == 0) return false;

	let firstPath = pathname.split('/')[1];

	return adminRoutes.includes(firstPath);
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
		supabaseKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

		return session;
	};

	event.locals.getUser = async (): Promise<Tables<'users'> | null> => {
		const { data, error } = await event.locals.supabase.from('users').select().single();

		if (error) return null;

		return data;
	};

	if (isLoggedInRoute(event.url.pathname)) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}

	if (isAdminRoute(event.url.pathname)) {
		const user = await event.locals.getUser();

		if (!user || !user.is_admin) {
			throw redirect(303, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
