import type { FullPlayerStats } from './+page.server';

export type SortKey = 'points' | 'goals' | 'assists' | 'clutches' | 'clean_sheets' | 'victories' | 'name';

export type Header = {
	sortKey: SortKey;
	label: string;
	field: keyof FullPlayerStats;
	color?: string;
	abbreviation?: string;
	isIcon?: boolean;
};
