// src/hooks.server.ts

import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Tables } from '$lib/types/database.helper.types';
import { adminRoutes, loggedInRoutes } from '$lib/shared/routes';

import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { Database } from '$lib/types/database.generated.types';

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

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	event.locals.getGuttaUser = async (): Promise<Tables<'users'> | null> => {
		const { session, user } = await event.locals.safeGetSession();

		if (session && user) {
			// Get public user
			const { data, error } = await event.locals.supabase.from('users').select('*').eq('id', user.id).single();

			if (error) return null;

			return data;
		}

		return null;
	};

	event.locals.getSeason = async (): Promise<Tables<'seasons'> | null> => {
		let session = await event.locals.safeGetSession();

		if (session) {
			let todayDate = new Date().toLocaleString();

			const { data, error } = await event.locals.supabase
				.from('seasons')
				.select()
				.lt('start_time', todayDate)
				.order('start_time', { ascending: false })
				.limit(1)
				.single();

			if (error) return null;

			return data;
		}

		return null;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/private');
	}

	if (!event.locals.session) {
		if (isLoggedInRoute(event.url.pathname)) {
			throw redirect(303, '/login');
		}
	}

	if (event.locals.session) {
		if (isAdminRoute(event.url.pathname)) {
			const guttaUser = await event.locals.getGuttaUser();

			if (!guttaUser || !guttaUser.is_admin) {
				throw redirect(303, '/');
			}
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
