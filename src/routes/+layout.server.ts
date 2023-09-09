import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, getUser, getSeason } }) => {
	const session = await getSession();
	const user = await getUser();
	const season = await getSeason();

	return {
		user: user,
		season: season,
		session: session
	};
};
