import type { Season } from './types/database-helpers';

export const isSeasonFinished = (season: Season | null): boolean => {
	if (!season) return true;

	const currentDate = new Date();
	const endDate = new Date(season.end_time);
	return currentDate > endDate;
};

export const isSeasonPastDeadline = (season: Season | null): boolean => {
	if (!season) return true;

	const currentDate = new Date();
	const deadlineDate = new Date(season.deadline_time);
	return currentDate > deadlineDate;
};
