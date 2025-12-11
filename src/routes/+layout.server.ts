import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, season }, cookies }) => {
	const { session, user, profile } = await safeGetSession();
	const currentSeason = await season();

	return {
		session: session,
		user: user,
		profile: profile,
		currentSeason: currentSeason,
		cookies: cookies.getAll()
	};
};
