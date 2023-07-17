// Interface to be stored elsewhere

export interface Player {
    pid: number;
    name: string;
    price: number;
    image: string;
    goals: number;
    assist: number;
    clutch: number;
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
    wins: number;
    draws: number;
    losses: number;
}

export interface UserDB {
	id: number;
    username: string;
    is_admin: boolean,
    cash: number,
    players: string,
	captain: number;
}

export interface User {
    email: string,
    username: string,
	is_admin: boolean;
    cash: number;
}

export interface FantasyForm {
    team: Player[],
    money: number,
    captain: number,
    selectedCard: number,
}