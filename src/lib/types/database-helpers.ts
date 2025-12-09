import type { Database } from './database.generated.types';

export type Profile = Database['public']['Tables']['users']['Row'];

export function tableSeasonRowToSeason(row: Database['public']['Tables']['seasons']['Row']): Season {
	return {
		...row,
		deadline_time: new Date(row.deadline_time),
		end_time: new Date(row.end_time),
		start_time: new Date(row.start_time)
	};
}

export type Season = Omit<Database['public']['Tables']['seasons']['Row'], 'deadline_time' | 'end_time' | 'start_time'> & {
	deadline_time: Date;
	end_time: Date;
	start_time: Date;
};
