export type PlayerInfo = {
	id: number;
	name: string;
	image: string;
	inform_image: string | null;
	outofform_image: string | null;
	attack: number;
	defence: number;
	physical: number;
	skill: number;
	morale: number;
	price: number;
	team: {
		id: number;
		name: string;
		color: string;
	};
};
