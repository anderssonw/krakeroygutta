export interface FantasyTeam {
	id?: number;
	name: string;
	captainId: number;
	playerIds: number[];
	createdAt?: string;
}
