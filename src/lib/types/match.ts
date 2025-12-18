export type MatchTeam = {
	id: number;
	name: string;
	color: string;
	players: MatchPlayer[];
};

export type MatchPlayer = {
	player_id: number;
	name: string;
};

export type MatchGoal = {
	id: number;
	goal_player_id: number;
	assist_player_id: number | null;
};

export type MatchClutch = {
	id: number;
	clutch_player_id: number;
};

export type MatchDetails = {
	id: number;
	home_team: MatchTeam;
	away_team: MatchTeam;
	goals: MatchGoal[];
	clutches: MatchClutch[];
};
