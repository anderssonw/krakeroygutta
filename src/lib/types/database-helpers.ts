import type { Database } from './database.generated.types';

export type Profile = Database['public']['Tables']['users']['Row'];

export type Season = Omit<Database['public']['Tables']['seasons']['Row'], 'deadline_time' | 'end_time' | 'start_time'> & {
	deadline_time: Date;
	end_time: Date;
	start_time: Date;
};

export type Team = Database['public']['Tables']['teams']['Row'];
