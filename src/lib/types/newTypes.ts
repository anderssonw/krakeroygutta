// Interface to be stored elsewhere



/* ------ GENERAL - DATABASE ------ */
export interface Player {
    pid: number;
    name: string;
    price: number;
    image: string;
    attack: number;
    defence: number;
    physical: number;
    morale: number;
}

export interface Season {
    sid: number;
    name: string;
    start_date: string;
    end_date: string;
}

export interface Team {
    tid: number;
    sid: number;
    name: string;
    color: string;
    players: number[];
    wins: number;
    draws: number;
    losses: number;
}

export interface Fantasy {
    fid: number;
    uid: string;
    sid: number;
    team_name: string;
    players: number[];
    captain: number;
    cash: number;
}

export interface UserDB {
	uid: string;
    is_admin: boolean;
}

export interface UserClient {
    uid: string;
    email: string;
	is_admin: boolean;
}

/* ------ SEASON PAGE ------ */
export interface FantasyStanding {
    team_name: string;
    players: number[];
}

/* ------ FANTASY PAGE ------ */
export interface FantasyForm {
    team: Player[];
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
export interface DropdownOption {
    id: number;
    name: string;
}
export interface TeamColor {
    tid: number;
    name: string;
}