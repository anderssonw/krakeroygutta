// Interface to be stored elsewhere

export interface User {
	UserID: number;
    Email: string,
    Password: string,
    Name: string,
	IsAdmin: boolean;
    PlayerIDs: number[];
    Currency: number;
}

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



