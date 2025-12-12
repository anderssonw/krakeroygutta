import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, season }, cookies }) => {
	const { session, profile } = await safeGetSession();
	const seasonData = await season();

	return {
		session: session,
		profile: profile,
		season: seasonData,
		cookies: cookies.getAll()
	};
};
