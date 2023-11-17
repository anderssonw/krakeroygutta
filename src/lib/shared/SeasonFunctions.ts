// TODO This should probably be stores

import type { Tables } from '$lib/types/database.helper.types';

export const isSeasonActive = (season: Tables<'seasons'>) => {
	let todayTimeString = new Date().toISOString();

	if (season.start_time < todayTimeString && season.end_time > todayTimeString) {
		return true;
	}

	return false;
};

export const isSeasonPastDeadline = (season: Tables<'seasons'>) => {
	let todayTimeString = new Date().toISOString();

	if (season.deadline_time < todayTimeString) {
		return true;
	}

	return false;
};

export const isSeasonPastEnd = (season: Tables<'seasons'>) => {
	let todayTimeString = new Date().toISOString();

	if (season.end_time < todayTimeString) {
		return true;
	}

	return false;
};
