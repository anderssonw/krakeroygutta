import { AuthError, createClient, PostgrestError } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/**
 * Wraps a Supabase database query and handles errors by logging and throwing
 */
export async function supabaseQuery<T>(
	queryPromise: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
	errorContext?: string
): Promise<T | null> {
	const result = await queryPromise;

	if (result.error) {
		const context = errorContext ? `${errorContext}: ` : '';
		console.error(`${context}Supabase error:`, result.error);
		throw new Error(`${context}${result.error.message}`);
	}

	return result.data;
}

/**
 * Defers a data loading operation for streaming.
 * Use this in load functions to return promises that resolve after initial page render.
 *
 * @example
 * ```ts
 * export const load = async ({ locals }) => {
 *   const season = await getSeason(); // Critical data - loads immediately
 *
 *   return {
 *     season,
 *     players: defer(async () => {
 *       // Heavy queries - will stream in
 *       const data = await fetchPlayers(season.id);
 *       return processPlayers(data);
 *     })
 *   };
 * };
 * ```
 */
export function defer<T>(fn: () => Promise<T>): Promise<T> {
	return fn();
}

/**
 * Defers multiple data loading operations and returns them as a single promise.
 * Useful when you want to wait for multiple deferred operations together.
 *
 * @example
 * ```ts
 * export const load = async ({ locals }) => {
 *   const season = await getSeason();
 *
 *   return {
 *     season,
 *     ...deferAll({
 *       players: async () => fetchPlayers(season.id),
 *       matches: async () => fetchMatches(season.id),
 *       teams: async () => fetchTeams(season.id)
 *     })
 *   };
 * };
 * ```
 */
export function deferAll<T extends Record<string, () => Promise<any>>>(
	deferredFns: T
): { [K in keyof T]: Promise<Awaited<ReturnType<T[K]>>> } {
	const result = {} as { [K in keyof T]: Promise<Awaited<ReturnType<T[K]>>> };

	for (const key in deferredFns) {
		result[key] = defer(deferredFns[key]);
	}

	return result;
}
