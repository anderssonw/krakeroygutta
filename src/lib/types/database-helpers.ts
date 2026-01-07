import type { Database } from './database.generated.types';

export type Profile = Database['public']['Tables']['users']['Row'];

export type Season = Omit<Database['public']['Tables']['seasons']['Row'], 'deadline_time' | 'end_time' | 'start_time'> & {
	deadline_time: Date;
	end_time: Date;
	start_time: Date;
};

export type Team = Database['public']['Tables']['teams']['Row'];

/**
 * Helper type to preserve nullability from table columns when using views
 * Views in PostgreSQL always mark columns as nullable, but we want to preserve
 * the original nullability from the base table.
 */
type PreserveNullability<T> = null extends T ? T : Exclude<T, null>;

/**
 * Transform a view type to preserve nullability from the original table type
 * Only transforms properties that exist in both the table and the view
 */
type TransformToView<Table, View> = {
	[K in Extract<keyof View, keyof Table>]: PreserveNullability<Table[K]>;
};

// Helper to get table types
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Helper to get view types
type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

/**
 * Season player statistics with correct nullability
 * Maps the view columns to the original table columns to preserve nullability
 */
export type SeasonPlayerStatisticsView = TransformToView<
	Tables<'players'> & Tables<'players_seasons'>,
	Views<'season_player_statistics'>
> & {
	// Add the computed fields that don't exist in the base tables
	goals: number;
	assists: number;
	clutches: number;
	team_id: number | null;
	team_name: string | null;
	team_color: string | null;
};

/**
 * Season team statistics with correct nullability
 * Maps the view columns to the original table columns to preserve nullability
 */
export type SeasonTeamStatisticsView = TransformToView<Tables<'teams'>, Views<'season_team_statistics'>> & {
	// Add the computed fields that don't exist in the base table
	wins: number;
	losses: number;
	ties: number;
	clean_sheets: number;
};
