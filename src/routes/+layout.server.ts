import type { LayoutServerLoad } from './$types';
import type { Tables } from '$lib/types/database.helper.types';

export const load: LayoutServerLoad = async ({ locals: { getSession, getUser, getSeason } }) => {
	const session = await getSession();
	const user = await getUser();
	const season = await getSeason();

	return {
		user: user,
		season: (season ? season as Tables<'seasons'> : null), // Need to fix Promise<unknown>
		session: session
	};
};
