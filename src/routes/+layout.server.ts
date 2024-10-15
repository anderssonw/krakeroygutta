import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, getGuttaUser, getSeason }, cookies }) => {
	const { session } = await safeGetSession();
	const guttaUser = await getGuttaUser();
	const season = await getSeason();
	return {
		session,
		user: guttaUser,
		season: season,
		cookies: cookies.getAll()
	};
};
