import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	throw error(413, {
		message: 'HTTP Code 413 - Payload Too Large',
		devHelper: 'Kode 413, Payload Too Large ble sendt. Forsøk å sende en forespørsel om et objekt som krever mindre plass.'
	});
};
