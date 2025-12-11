// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';
import { tableSeasonRowToSeason, type Season } from '$lib/types/database-helpers';
import type { Database } from '$lib/types/database.generated.types';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
      getAll() {
        return event.cookies.getAll()
      },
      setAll(cookiesToSet) {
        /**
         * Note: You have to add the `path` variable to the
         * set and remove method due to sveltekit's cookie API
         * requiring this to be set, setting the path to an empty string
         * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
         */
        cookiesToSet.forEach(({ name, value, options }) =>
          event.cookies.set(name, value, { ...options, path: '/' })
        )
      },
    },
	});

	/**
	 * Unlike `supabase.auth.getSession`, which is unsafe on the server because it
	 * doesn't validate the JWT, this function validates the JWT by first calling
	 * `getUser` and aborts early if the JWT signature is invalid.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { session: null, user: null, profile: null };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (session && user) {
			const { data, error } = await event.locals.supabase.from('users').select('*').eq('id', user.id).single();
			if (error) {
				console.log('Error fetching profile:', error.message);
				return { session, user, profile: null };
			}

			return { session, user, profile: data };
		}

		return { session, user, profile: null };
	};

	event.locals.season = async () => {
		const { data, error } = await event.locals.supabase.from('seasons').select('*');
		if (error) {
			console.log('Error fetching season:', error.message);
			return null;
		}

		if (!data || data.length === 0) {
			return null;
		}

		const now = new Date();

		// Convert string dates to Date objects
		const seasons: Season[] = data.map(tableSeasonRowToSeason);

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
