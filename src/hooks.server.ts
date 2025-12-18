import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { fetchAllSeasons } from '$lib/queries';
import { routes } from '$lib/routing';
import { supabaseQuery } from '$lib/supabaseClient';
import { type Profile } from '$lib/types/database-helpers';
import type { Database } from '$lib/types/database.generated.types';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const locals: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				/**
				 * Note: You have to add the `path` variable to the
				 * set and remove method due to sveltekit's cookie API
				 * requiring this to be set, setting the path to an empty string
				 * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
				 */
				cookiesToSet.forEach(({ name, value, options }) => event.cookies.set(name, value, { ...options, path: '/' }));
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { session: null, profile: null };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (session && user) {
			const profile = await supabaseQuery<Profile>(event.locals.supabase.from('users').select('*').eq('id', user.id).maybeSingle());

			if (profile) {
				return { session, profile };
			}
		}

		return { session, profile: null };
	};

	event.locals.getSeason = async () => {
		const seasons = await fetchAllSeasons(event.locals.supabase);

		if (!seasons || seasons.length === 0) {
			return null;
		}

		const now = new Date();

		const currentSeason = seasons.find((season) => now >= season.start_time && now <= season.end_time);

		if (currentSeason) {
			return currentSeason;
		}

		const upcomingSeasons = seasons
			.filter((season) => season.start_time > now)
			.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

		return upcomingSeasons[0] || null;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name: string) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { profile } = await event.locals.safeGetSession();

	const pathName = event.url.pathname;

	const routeFromPath = routes.find((route) => pathName.includes(route.href));

	if (!routeFromPath) {
		return resolve(event);
	}

	// Require authentication
	if (routeFromPath.requiresAuth && !profile) {
		redirect(303, '/login');
	}

	// Require admin privileges
	if (routeFromPath.requiresAdmin && !profile?.is_admin) {
		redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(locals, authGuard);
