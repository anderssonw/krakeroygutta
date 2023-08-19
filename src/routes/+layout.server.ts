import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
	const { data: user, error: userError } = await supabase.from('users').select().single();

	if (userError) {
		return {
			user: null,
			season: null,
			session: await getSession(),
			supabaseErrorMessage: userError.message
		};
	}

	let todayTimeString = new Date().toDateString();

	const { data: season, error: seasonError } = await supabase
		.from('seasons')
		.select()
		.lt('start_time', todayTimeString)
		.gt('end_time', todayTimeString)
		.single();

	if (seasonError) {
		return {
			user: user,
			season: null,
			session: getSession(),
			supabaseErrorMessage: seasonError.message
		};
	}

	return {
		user,
		season,
		session: getSession()
	};
};
