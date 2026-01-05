import { PostgrestError } from '@supabase/supabase-js';

/**
 * Wraps a Supabase database query and handles errors by logging and throwing
 *
 * Et problem med denne er at den ikke er noe fan av .single() og .maybeSingle(). I tillegg
 * fungerer den ikke med auth-spørringer mot supabase, kun vanlige queries.
 * Bør undersøke om det er mulig å utvide den til å støtte queries, med single, og kanskje upserts/deletes.
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
 * Defers a data loading operation for SvelteKit streaming.
 *
 * In SvelteKit, to enable streaming you simply return a Promise from your load function
 * without awaiting it. This function is a semantic wrapper that makes the intent clear
 * and provides a consistent pattern for deferred data loading.
 *
 * The promise will start executing immediately but won't block the initial page render.
 * Use the {#await} block in Svelte components to handle loading states.
 *
 * @example
 * ```ts
 * export const load = async ({ locals }) => {
 *   const season = await getSeason(); // Critical data - loads immediately
 *
 *   return {
 *     season,
 *     players: defer(() => fetchPlayers(season.id)) // Streams in after initial render
 *   };
 * };
 * ```
 *
 * @param fn - An async function that returns the data to be loaded
 * @returns A promise that will stream to the client
 */
export function defer<T>(fn: () => Promise<T>): Promise<T> {
	// SvelteKit handles streaming automatically when you return an unawaited promise
	// This function exists to make the intent explicit and provide a consistent API
	return fn();
}

/**
 * Defers multiple data loading operations for SvelteKit streaming.
 *
 * Each promise starts executing immediately but won't block the initial page render.
 * This is syntactic sugar for returning multiple deferred promises.
 *
 * @example
 * ```ts
 * export const load = async ({ locals }) => {
 *   const season = await getSeason();
 *
 *   return {
 *     season,
 *     ...deferAll({
 *       players: () => fetchPlayers(season.id),
 *       matches: () => fetchMatches(season.id),
 *       teams: () => fetchTeams(season.id)
 *     })
 *   };
 * };
 * ```
 *
 * @param deferredFns - Object mapping keys to async functions
 * @returns Object with the same keys, each mapped to a streaming promise
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
