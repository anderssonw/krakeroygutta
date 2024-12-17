import { type Actions, error } from '@sveltejs/kit';
import type { TablesInsert, TablesUpdate } from '$lib/types/database.helper.types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
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

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const seasonName = formData.get('seasonName')?.toString();
		const seasonStart = formData.get('seasonStart')?.toString();
		const seasonDeadline = formData.get('seasonDeadline')?.toString();
		const seasonEnd = formData.get('seasonEnd')?.toString();
		const startingCurrency = Number(formData.get('seasonStartingCurrency'));

		// Check overlapping dates
		let isOverlapDate: boolean = false;
		// Do this via database constraints?
		/*
        const seasonsQuery = await supabase.from('seasons').select();
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);
                // Season start for the new season is overlapping with another season
                if (seasonStart >= seasonStart && seasonStart <= seasonEnd) {
                    isOverlapDate = true;
                }
                // Today is between start and end of the season => ongoing season
                if (seasonEnd >= seasonStart && seasonEnd <= seasonEnd) {
                    isOverlapDate = true;
                }
            });
        }
        */

		if (seasonName && seasonStart && seasonDeadline && seasonEnd && startingCurrency && !isOverlapDate) {
			const seasonForm: TablesInsert<'seasons'> = {
				name: seasonName,
				start_time: seasonStart,
				deadline_time: seasonDeadline,
				end_time: seasonEnd,
				starting_currency: startingCurrency
			};

			const { error: insertError } = await supabase.from('seasons').insert(seasonForm);

			if (insertError) {
				throw error(500, {
					message: insertError.message,
					devHelper: '/admin/seasons inserting season'
				});
			}
		}

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const seasonId = Number(formData.get('id'));

		if (seasonId) {
			const { error: deleteFail } = await supabase.from('seasons').delete().eq('id', seasonId);

			if (deleteFail) {
				throw error(500, {
					message: deleteFail.message,
					devHelper: '/admin/seasons deleting season'
				});
			}
		}

		return { success: true };
	}
} satisfies Actions;
