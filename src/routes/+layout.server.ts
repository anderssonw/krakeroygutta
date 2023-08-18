import type { Tables } from '$lib/types/database.helper.types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession }, params, cookies }) => {
	const userQuery = await supabase.from('users').select();

	let user: Tables<'users'> | null = null;

	if (userQuery.data != null) {
		user = userQuery.data[0];
	}

	return {
		user: user,
		session: getSession()
	};
};
