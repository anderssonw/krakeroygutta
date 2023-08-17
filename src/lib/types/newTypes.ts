// Interface to be stored elsewhere

/* ------ GENERAL - DATABASE ------ */
export interface Player {
	id: number;
	name: string;
	image: string;
}

export interface Season {
	id: number;
	name: string;
	start_time: string;
	deadline_time: string;
	end_time: string;
	starting_curency: number;
}

export interface Team {
	id: number;
	season_id: number;
	name: string;
	color: string;
	player_ids: number[];
}

export interface Fantasy {
	user_id: number;
	season_id: number;
	name: string;
	player_ids: number[];
	captain_id: number;
}

export interface UserDB {
	id: string;
	is_admin: boolean;
	is_superadmin: boolean;
}

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
export interface PlayerPoints {
	pid: number;
	points: number;
}

/* ------ FANTASY PAGE ------ */
export interface FantasyForm {
	team: Player[];
	team_name: string;
	cash: number;
	captain: number;
	selectedCard: number;
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
