interface BasePlayer {
	id: number;
	name: string;
	image: string;
}

interface SeasonPlayer extends BasePlayer {
	inform_image: string | null;
	outofform_image: string | null;
	attack: number;
	defence: number;
	physical: number;
	skill: number;
	morale: number;
	price: number;
}

export interface SeasonAndTeamPlayer extends SeasonPlayer {
	team: {
		id: number;
		name: string;
		color: string;
	};
}
