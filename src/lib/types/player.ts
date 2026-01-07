export interface BasePlayer {
	id: number;
	name: string;
	image: string;
}

export interface SeasonPlayer extends BasePlayer {
	inform_image: string | null;
	outofform_image: string | null;
	attack: number;
	defence: number;
	physical: number;
	skill: number;
	morale: number;
	price: number;
	season_id: number;
	team: {
		id: number;
		name: string;
		color: string;
	} | null;
}

export interface SeasonPlayerStats extends SeasonPlayer {
	goals: number;
	assists: number;
	clutches: number;
}

export interface SeasonPlayerFullStats extends SeasonPlayerStats {
	cleanSheets: number;
	victories: number;
	totalScore: number;
}
