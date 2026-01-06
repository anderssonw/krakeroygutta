export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			bets: {
				Row: {
					bet: string;
					id: number;
					season_id: number;
					user_id: string;
					value: number;
				};
				Insert: {
					bet: string;
					id?: number;
					season_id: number;
					user_id: string;
					value: number;
				};
				Update: {
					bet?: string;
					id?: number;
					season_id?: number;
					user_id?: string;
					value?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'bets_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'bets_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			bets_against: {
				Row: {
					bet_id: number;
					id: number;
					user_id: string;
				};
				Insert: {
					bet_id: number;
					id?: number;
					user_id: string;
				};
				Update: {
					bet_id?: number;
					id?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'bets_against_bet_id_fkey';
						columns: ['bet_id'];
						isOneToOne: false;
						referencedRelation: 'bets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'bets_against_bet_id_fkey';
						columns: ['bet_id'];
						isOneToOne: false;
						referencedRelation: 'bets_with_challengers';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'bets_against_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			clutches: {
				Row: {
					id: number;
					is_negative: boolean;
					match_id: number;
					player_id: number;
				};
				Insert: {
					id?: number;
					is_negative?: boolean;
					match_id: number;
					player_id: number;
				};
				Update: {
					id?: number;
					is_negative?: boolean;
					match_id?: number;
					player_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'clutches_match_id_fkey';
						columns: ['match_id'];
						isOneToOne: false;
						referencedRelation: 'matches';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'clutches_match_id_fkey';
						columns: ['match_id'];
						isOneToOne: false;
						referencedRelation: 'team_with_stats';
						referencedColumns: ['match_id'];
					},
					{
						foreignKeyName: 'clutches_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'clutches_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					}
				];
			};
			fantasy_teams: {
				Row: {
					captain_id: number | null;
					id: number;
					name: string;
					season_id: number;
					user_id: string;
				};
				Insert: {
					captain_id?: number | null;
					id?: number;
					name: string;
					season_id: number;
					user_id: string;
				};
				Update: {
					captain_id?: number | null;
					id?: number;
					name?: string;
					season_id?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'fantasy_teams_captain_id_fkey';
						columns: ['captain_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'fantasy_teams_captain_id_fkey';
						columns: ['captain_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'fantasy_teams_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'fantasy_teams_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			fantasy_teams_players: {
				Row: {
					fantasy_team_id: number;
					player_id: number;
				};
				Insert: {
					fantasy_team_id: number;
					player_id: number;
				};
				Update: {
					fantasy_team_id?: number;
					player_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'fantasy_teams_players_fantasy_team_id_fkey';
						columns: ['fantasy_team_id'];
						isOneToOne: false;
						referencedRelation: 'fantasy_teams';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'fantasy_teams_players_fantasy_team_id_fkey';
						columns: ['fantasy_team_id'];
						isOneToOne: false;
						referencedRelation: 'fantasy_with_players';
						referencedColumns: ['fantasy_team_id'];
					},
					{
						foreignKeyName: 'fantasy_teams_players_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'fantasy_teams_players_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					}
				];
			};
			goals: {
				Row: {
					assist_player_id: number | null;
					goal_player_id: number;
					id: number;
					match_id: number;
				};
				Insert: {
					assist_player_id?: number | null;
					goal_player_id: number;
					id?: number;
					match_id: number;
				};
				Update: {
					assist_player_id?: number | null;
					goal_player_id?: number;
					id?: number;
					match_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'goals_assist_player_id_fkey';
						columns: ['assist_player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'goals_assist_player_id_fkey';
						columns: ['assist_player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'goals_goal_player_id_fkey';
						columns: ['goal_player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'goals_goal_player_id_fkey';
						columns: ['goal_player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'goals_match_id_fkey';
						columns: ['match_id'];
						isOneToOne: false;
						referencedRelation: 'matches';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'goals_match_id_fkey';
						columns: ['match_id'];
						isOneToOne: false;
						referencedRelation: 'team_with_stats';
						referencedColumns: ['match_id'];
					}
				];
			};
			matches: {
				Row: {
					id: number;
					season_id: number;
					team_away_id: number;
					team_home_id: number;
				};
				Insert: {
					id?: number;
					season_id: number;
					team_away_id: number;
					team_home_id: number;
				};
				Update: {
					id?: number;
					season_id?: number;
					team_away_id?: number;
					team_home_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'matches_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_team_away_id_fkey';
						columns: ['team_away_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'matches_team_away_id_fkey';
						columns: ['team_away_id'];
						isOneToOne: false;
						referencedRelation: 'team_with_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'matches_team_away_id_fkey';
						columns: ['team_away_id'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_team_home_id_fkey';
						columns: ['team_home_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'matches_team_home_id_fkey';
						columns: ['team_home_id'];
						isOneToOne: false;
						referencedRelation: 'team_with_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'matches_team_home_id_fkey';
						columns: ['team_home_id'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					}
				];
			};
			players: {
				Row: {
					id: number;
					image: string;
					name: string;
				};
				Insert: {
					id?: number;
					image?: string;
					name?: string;
				};
				Update: {
					id?: number;
					image?: string;
					name?: string;
				};
				Relationships: [];
			};
			players_seasons: {
				Row: {
					attack: number;
					defence: number;
					inform_image: string | null;
					morale: number;
					outofform_image: string | null;
					physical: number;
					player_id: number;
					price: number;
					season_id: number;
					skill: number;
				};
				Insert: {
					attack?: number;
					defence?: number;
					inform_image?: string | null;
					morale?: number;
					outofform_image?: string | null;
					physical?: number;
					player_id: number;
					price?: number;
					season_id: number;
					skill?: number;
				};
				Update: {
					attack?: number;
					defence?: number;
					inform_image?: string | null;
					morale?: number;
					outofform_image?: string | null;
					physical?: number;
					player_id?: number;
					price?: number;
					season_id?: number;
					skill?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'players_seasons_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'players_seasons_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'players_seasons_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					}
				];
			};
			seasons: {
				Row: {
					deadline_time: string;
					end_time: string;
					id: number;
					name: string;
					points_per_assist: number;
					points_per_clean_sheet: number;
					points_per_clutch: number;
					points_per_goal: number;
					points_per_win: number;
					start_time: string;
					starting_currency: number;
				};
				Insert: {
					deadline_time: string;
					end_time: string;
					id?: number;
					name: string;
					points_per_assist?: number;
					points_per_clean_sheet?: number;
					points_per_clutch?: number;
					points_per_goal?: number;
					points_per_win?: number;
					start_time: string;
					starting_currency?: number;
				};
				Update: {
					deadline_time?: string;
					end_time?: string;
					id?: number;
					name?: string;
					points_per_assist?: number;
					points_per_clean_sheet?: number;
					points_per_clutch?: number;
					points_per_goal?: number;
					points_per_win?: number;
					start_time?: string;
					starting_currency?: number;
				};
				Relationships: [];
			};
			teams: {
				Row: {
					color: string;
					id: number;
					name: string;
					season_id: number;
				};
				Insert: {
					color?: string;
					id?: number;
					name: string;
					season_id: number;
				};
				Update: {
					color?: string;
					id?: number;
					name?: string;
					season_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'teams_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					}
				];
			};
			teams_players: {
				Row: {
					id: number;
					player_id: number;
					team_id: number;
				};
				Insert: {
					id?: number;
					player_id: number;
					team_id: number;
				};
				Update: {
					id?: number;
					player_id?: number;
					team_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'teams_players_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'teams_players_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'teams_players_team_id_fkey';
						columns: ['team_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'teams_players_team_id_fkey';
						columns: ['team_id'];
						isOneToOne: false;
						referencedRelation: 'team_with_stats';
						referencedColumns: ['team_id'];
					},
					{
						foreignKeyName: 'teams_players_team_id_fkey';
						columns: ['team_id'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					}
				];
			};
			users: {
				Row: {
					id: string;
					is_admin: boolean | null;
					is_superadmin: boolean | null;
					nickname: string;
					player_id: number | null;
				};
				Insert: {
					id: string;
					is_admin?: boolean | null;
					is_superadmin?: boolean | null;
					nickname?: string;
					player_id?: number | null;
				};
				Update: {
					id?: string;
					is_admin?: boolean | null;
					is_superadmin?: boolean | null;
					nickname?: string;
					player_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'users_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'users_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			bets_with_challengers: {
				Row: {
					bet: string | null;
					better: Json | null;
					challengers: Json | null;
					id: number | null;
					season_id: number | null;
					value: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'bets_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					}
				];
			};
			fantasy_with_players: {
				Row: {
					captain_id: number | null;
					fantasy_team_id: number | null;
					name: string | null;
					player_ids: number[] | null;
					season_id: number | null;
					user_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'fantasy_teams_captain_id_fkey';
						columns: ['captain_id'];
						isOneToOne: false;
						referencedRelation: 'player_season_stats';
						referencedColumns: ['player_id'];
					},
					{
						foreignKeyName: 'fantasy_teams_captain_id_fkey';
						columns: ['captain_id'];
						isOneToOne: false;
						referencedRelation: 'players';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'fantasy_teams_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'fantasy_teams_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			player_season_stats: {
				Row: {
					attack: number | null;
					defence: number | null;
					image: string | null;
					inform_image: string | null;
					morale: number | null;
					name: string | null;
					outofform_image: string | null;
					physical: number | null;
					player_id: number | null;
					price: number | null;
					season_id: number | null;
					skill: number | null;
					team_color: string | null;
					team_id: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'players_seasons_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					}
				];
			};
			team_with_stats: {
				Row: {
					color: string | null;
					match_id: number | null;
					name: string | null;
					players: Json | null;
					season_id: number | null;
					team_id: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'matches_season_id_fkey';
						columns: ['season_id'];
						isOneToOne: false;
						referencedRelation: 'seasons';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
					owner: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					name: string;
					owner?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
					owner?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					updated_at: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					updated_at?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						isOneToOne: false;
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			extension: { Args: { name: string }; Returns: string };
			filename: { Args: { name: string }; Returns: string };
			foldername: { Args: { name: string }; Returns: string[] };
			search: {
				Args: {
					bucketname: string;
					levels?: number;
					limits?: number;
					offsets?: number;
					prefix: string;
				};
				Returns: {
					created_at: string;
					id: string;
					last_accessed_at: string;
					metadata: Json;
					name: string;
					updated_at: string;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	public: {
		Enums: {}
	},
	storage: {
		Enums: {}
	}
} as const;
