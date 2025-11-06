import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, getGuttaUser, getLatestSeasons }, cookies }) => {
	const { session } = await safeGetSession();
	const guttaUser = await getGuttaUser();
	const latestSeasons = await getLatestSeasons();
	return {
		session,
		user: guttaUser,
		season: latestSeasons.length >= 1 ? latestSeasons[0] : null,
		previousSeason: latestSeasons.length >= 2 ? latestSeasons[1] : null,
		cookies: cookies.getAll()
	};
};
