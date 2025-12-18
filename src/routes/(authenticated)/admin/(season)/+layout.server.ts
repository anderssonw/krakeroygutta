import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { fetchAllSeasons } from '$lib/queries';
import { replaceState } from '$app/navigation';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSeason } }) => {
	const allSeasons = await fetchAllSeasons(supabase);
	const currentSeason = await getSeason();

	return {
		currentSeason,
		seasons: allSeasons
	};
};
