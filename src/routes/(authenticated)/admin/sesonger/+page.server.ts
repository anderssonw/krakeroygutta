import { fetchAllSeasons } from '$lib/queries';
import { supabaseQuery } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase } }) => {
	const seasons = await fetchAllSeasons(supabase);

	return {
		seasons
	};
}) satisfies PageServerLoad;

// Zod schema for updating a season
const updateSeasonSchema = zfd.formData({
	seasonId: zfd.numeric(z.number().int().positive()),
	name: zfd.text(z.string().min(1, 'Sesongnavnet kan ikke være tomt').max(255).trim()),
	starting_currency: zfd.numeric(z.number().int().positive('Startkapital må være et positivt tall')),
	start_time: zfd.text(z.string().min(1, 'Starttidspunkt er påkrevd')),
	deadline_time: zfd.text(z.string().min(1, 'Deadline er påkrevd')),
	end_time: zfd.text(z.string().min(1, 'Sluttidspunkt er påkrevd')),
	points_per_goal: zfd.numeric(z.number().int().nonnegative('Poeng per mål må være 0 eller høyere')),
	points_per_assist: zfd.numeric(z.number().int().nonnegative('Poeng per assist må være 0 eller høyere')),
	points_per_clutch: zfd.numeric(z.number().int().nonnegative('Poeng per clutch må være 0 eller høyere')),
	points_per_win: zfd.numeric(z.number().int().nonnegative('Poeng per seier må være 0 eller høyere')),
	points_per_clean_sheet: zfd.numeric(z.number().int().nonnegative('Poeng per hold nullen må være 0 eller høyere'))
});

// Zod schema for deleting a season
const deleteSeasonSchema = zfd.formData({
	seasonId: zfd.numeric(z.number().int().positive())
});

export const actions = {
	update: async ({ request, locals: { supabase } }) => {
		const result = updateSeasonSchema.safeParse(await request.formData());

		if (!result.success) {
			return fail(400, {
				error: 'Valideringsfeil',
				message: result.error.message
			});
		}

		const { seasonId, start_time, deadline_time, end_time, ...updateData } = result.data;

		// Validate that dates are in correct order
		const startDate = new Date(start_time);
		const deadlineDate = new Date(deadline_time);
		const endDate = new Date(end_time);

		if (startDate >= deadlineDate) {
			return fail(400, {
				error: 'Ugyldig datorekkefølge',
				message: 'Starttidspunkt må være før deadline'
			});
		}

		if (deadlineDate >= endDate) {
			return fail(400, {
				error: 'Ugyldig datorekkefølge',
				message: 'Deadline må være før sluttidspunkt'
			});
		}

		// Update the season
		const updateResult = await supabaseQuery(
			supabase
				.from('seasons')
				.update({
					...updateData,
					start_time,
					deadline_time,
					end_time
				})
				.eq('id', seasonId)
				.select(),
			'Kunne ikke oppdatere sesong'
		);

		if (!updateResult) {
			return fail(500, {
				error: 'Database-feil',
				message: 'Kunne ikke oppdatere sesongen. Prøv igjen senere.'
			});
		}

		return {
			success: true,
			message: `Sesongen "${updateData.name}" ble oppdatert`
		};
	},

	delete: async ({ request, locals: { supabase } }) => {
		const result = deleteSeasonSchema.safeParse(await request.formData());

		if (!result.success) {
			return fail(400, {
				error: 'Valideringsfeil',
				message: 'Ugyldig sesong-ID'
			});
		}

		const { seasonId } = result.data;

		const teamsCheck = await supabaseQuery(
			supabase.from('teams').select('id').eq('season_id', seasonId).limit(1),
			'Kunne ikke sjekke relaterte lag'
		);

		if (teamsCheck && teamsCheck.length > 0) {
			return fail(400, {
				error: 'Kan ikke slette sesong',
				message: 'Sesongen har relaterte lag. Slett lagene først.'
			});
		}

		// Delete the season
		const deleteResult = await supabaseQuery(supabase.from('seasons').delete().eq('id', seasonId).select(), 'Kunne ikke slette sesong');

		if (!deleteResult) {
			return fail(500, {
				error: 'Database-feil',
				message: 'Kunne ikke slette sesongen. Prøv igjen senere.'
			});
		}

		return {
			success: true,
			message: 'Sesongen ble slettet'
		};
	}
} satisfies Actions;
