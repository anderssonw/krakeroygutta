// Interface to be stored elsewhere

/* ------ GENERAL - DATABASE ------ */

export interface UserClient {
	id: string;
	email: string;
	is_admin: boolean;
	is_superadmin: boolean;
}

/* ------ SEASON PAGE ------ */
export interface FantasyStanding {
	team_name: string;
	players: number[];
}
export interface PlayerStats {
	player_id: number;
	name?: string;
	goals: number;
	assists: number;
	clutches: number;
}

export interface TeamStats {
	team_id: number;
	wins: number;
	losses: number;
	draws: number;
}

export interface FullPlayer {
	id: number;
	name: string;
	image: string;
	attack: number;
	defence: number;
	morale: number;
	physical: number;
	price: number;
}

/* ------ FANTASY PAGE ------ */
export interface FantasyForm {
	players: (FullPlayer | null)[];
	teamName: string;
	captainId: number;
	selectedCardPosition: number;
}

export interface CreateFantasy {
	uid: string;
	sid: number;
	team_name: string;
	players: number[];
	captain: number;
	cash: number;
}

/* ------ ADMIN PAGE ------ */
export interface CreateSeason {
	name: string;
	start_date: string;
	end_date: string;
}
export interface CreateTeam {
	sid: number;
	name: string;
	color: string;
	players: number[];
}
export interface CreateGoal {
	pid: number;
	sid: number;
	goals: number;
}
export interface DropdownOption {
	id: number;
	name: string;
}
export interface TeamColor {
	tid: number;
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
	id: number;
	name: string;
	color: string;
	players: MatchStatsPlayer[];
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
export interface BetImproved {
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