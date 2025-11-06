import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const { session } = await parent();

	if (session) {
		const { data: seasons, error: seasonsError } = await supabase.from('seasons').select();

		if (seasonsError) {
			error(500, {
				message: seasonsError.message,
				devHelper: '/statistics getting seasons'
			});
		}

		return { seasons };
	}

	return {};
};
