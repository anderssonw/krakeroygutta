import type { PageServerLoad } from '.svelte-kit/types/src/routes/admin/$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	let { user } = await parent();

	if (!user?.isAdmin) {
		throw error(401, { message: 'Du har ikke adgang til denne siden' });
	}
};
