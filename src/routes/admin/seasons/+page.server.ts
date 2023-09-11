import { fail, type Actions } from '@sveltejs/kit';
import type { TablesInsert } from '$lib/types/database.helper.types';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

        const seasonName = formData.get('seasonName')?.toString();
		const seasonStart = formData.get('seasonStart')?.toString();
        const seasonDeadline = formData.get('seasonDeadline')?.toString();
		const seasonEnd = formData.get('seasonEnd')?.toString();

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

        if (seasonName && seasonStart && seasonDeadline && seasonEnd && !isOverlapDate) {
            const seasonForm: TablesInsert<'seasons'> = {
                name: seasonName,
                start_time: seasonStart,
                deadline_time: seasonDeadline,
                end_time: seasonEnd
            }

            const { error: error } = await supabase.from('seasons').insert(seasonForm);

            if (error) {
				return fail(500, {
					supabaseErrorMessage: error.message
				});
			}
        }

        return { success: true };
	}
} satisfies Actions;