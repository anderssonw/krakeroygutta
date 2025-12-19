export type PlayerWithStats = {
	id: number;
	name: string;
	isInSeason: boolean;
	stats: {
		attack: number;
		defence: number;
		physical: number;
		morale: number;
		skill: number;
		price: number;
	};
};
