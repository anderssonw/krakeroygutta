interface BaseTeam {
	id: number;
	name: string;
	color: string;
	season_id: number;
}

export interface TeamWithPlayers extends BaseTeam {
	playersIds: number[];
}

export interface TeamStatistics extends TeamWithPlayers {
	wins: number;
	losses: number;
	ties: number;
	cleanSheets: number;
}
