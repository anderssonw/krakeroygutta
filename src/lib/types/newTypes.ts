// Interface to be stored elsewhere
export interface Season {
    SeasonID: number;
    Name: string,
    StartDate: string,
    EndDate: string
}

export interface Team {
    TeamID: number;
    SeasonID: number;
    Name: string,
    PlayerIDs: number[],
    Games: number,
    Win: number,
    Draw: number,
    Loss: number
}

export interface Player {
    PlayerID: number,
    Name: string,
    Price: number,
    Picture: string,
    Goals: number,
    Assist: number,
    Clutch: number
}

export interface User {
	UserID: number;
    Email: string,
    Password: string,
    Name: string,
	IsAdmin: boolean;
    PlayerIDs: number[];
    Currency: number;
}