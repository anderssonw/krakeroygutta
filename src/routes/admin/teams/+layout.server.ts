import { fail, type Actions, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { TablesInsert, TablesUpdate } from '$lib/types/database.helper.types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const { session, user } = await parent();

	if (session && user?.is_superadmin) {
		const { data: seasons, error: seasonsError } = await supabase.from('seasons').select();

		if (seasonsError) {
			throw error(500, {
				message: seasonsError.message,
				devHelper: '/admin/seasons getting seasons'
			});
		}

		return { seasons };
	}

	return {};
};
