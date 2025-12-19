import { type Actions, error } from '@sveltejs/kit';
import type { TablesInsert, TablesUpdate } from '$lib/types/database.helper.types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { session, user } = await parent();

	if (session && user?.is_superadmin) {
		const { data: seasons, error: seasonsError } = await supabase.from('seasons').select();

		if (seasonsError) {
			error(500, {
				message: seasonsError.message,
				devHelper: '/admin/seasons getting seasons'
			});
		}

		return { seasons };
	}

	return { seasons: [] };
};

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const seasonName = formData.get('seasonName')?.toString();
		const seasonStart = formData.get('seasonStart')?.toString();
		const seasonDeadline = formData.get('seasonDeadline')?.toString();
		const seasonEnd = formData.get('seasonEnd')?.toString();
		const startingCurrency = Number(formData.get('seasonStartingCurrency'));
		const pointsPerWin = Number(formData.get('seasonPointsPerWin'));
		const pointsPerCleanSheet = Number(formData.get('seasonPointsPerCleanSheet'));
		const pointsPerGoal = Number(formData.get('seasonPointsPerGoal'));
		const pointsPerAssist = Number(formData.get('seasonPointsPerAssist'));
		const pointsPerClutch = Number(formData.get('seasonPointsPerClutch'));

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

		if (
			seasonName &&
			seasonStart &&
			seasonDeadline &&
			seasonEnd &&
			startingCurrency &&
			pointsPerWin &&
			pointsPerCleanSheet &&
			pointsPerGoal &&
			pointsPerAssist &&
			pointsPerClutch &&
			!isOverlapDate
		) {
			const seasonForm: TablesInsert<'seasons'> = {
				name: seasonName,
				start_time: seasonStart,
				deadline_time: seasonDeadline,
				end_time: seasonEnd,
				starting_currency: startingCurrency,
				points_per_win: pointsPerWin,
				points_per_clean_sheet: pointsPerCleanSheet,
				points_per_goal: pointsPerGoal,
				points_per_assist: pointsPerAssist,
				points_per_clutch: pointsPerClutch
			};

			const { error: insertError } = await supabase.from('seasons').insert(seasonForm);

			if (insertError) {
				error(500, {
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
				error(500, {
					message: deleteFail.message,
					devHelper: '/admin/seasons deleting season'
				});
			}
		}

		return { success: true };
	}
} satisfies Actions;
