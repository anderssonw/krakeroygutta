import type { SeasonPlayerFullStats } from '$lib/types/player';
import type { TableHeader } from '$lib/types/table';

export type StatsSortKey = 'points' | 'goals' | 'assists' | 'clutches' | 'clean_sheets' | 'victories' | 'name';

export interface StatsTableHeader extends TableHeader<StatsSortKey> {
	field: keyof SeasonPlayerFullStats;
}
