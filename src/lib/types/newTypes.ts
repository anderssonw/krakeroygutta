// Interface to be stored elsewhere

import type { Tables } from "./database.helper.types";

/* ------ ADMIN PAGE ------ */
export interface SeasonForm {
	id?: number;
	name: string;
	startingCurrency: number;
	startTime: string;
	deadlineTime: string;
	endTime: string;
}

export interface DropdownOption {
	id: number;
	name: string;
}

/* MATCHES PAGE (GENERAL FOR ALL MATCH STATISTICS) */
export interface MatchStatsPlayer {
	id: number;
	name: string;
	goals: number;
	assists: number;
	clutches: number;
}
export interface MatchStatsTeam {
	match_id: number;
	team_id: number;
	name: string;
	color: string;
	players: MatchStatsPlayer[];
	season_id: number;
}
export interface MatchStatsQuery {
	match_id: number;
	season_id: number;
	home_team: MatchStatsTeam;
	away_team: MatchStatsTeam;
}

/* BETTING PAGE */
export interface BetUser {
    id: string;
    name: string;
}
export interface Bet {
    id: number;
    bet: string;
    value: number;
    better: BetUser;
    challengers: BetUser[];
}

/* TEAMS PAGE */
export interface FullTeam {
	season_id: number;
	color: string;
	name: string;
	players: FullPlayer[];
}

/* SEASON HOME PAGE */
export interface TeamWithStats {
	team_id: number;
	wins: number;
	losses: number;
	draws: number;
	color: string;
	name: string;
}

/* REVISIT WITH A VIEW? */
export interface FantasyTeamWithPlayers extends Tables<'fantasy_teams'> {
	fantasy_teams_players: {
		player_id: number;
	}[];
	points?: number;
}

export interface FantasyTeamFull extends FantasyTeamWithPlayers {
	points: number;
}

/* FANTASY PAGE */
export interface FantasyWithPlayers {
	fantasy_team_id: number;
	season_id: number;
	user_id: string;
	name: string;
	captain_id: number;
	player_ids: number[];
}
export interface FantasyForm {
	players: (FullPlayer | null)[];
	teamName: string;
	captainId: number;
	selectedCardPosition: number;
}

/* ALL PLAYERS CARDS */
export interface FullPlayer {
	player_id: number;
	name: string;
	image: string;
	attack: number;
	defence: number;
	morale: number;
	physical: number;
	price: number;
	team_color: string;
	team_id: number;
	season_id: number;
}

/* PLAYER/ID PAGE*/
export interface PlayerStats {
	goals: number;
	assists: number;
	clutches: number;
	wins: number;
	clean_sheets: number;
}