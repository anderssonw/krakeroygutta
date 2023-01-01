import type { Player } from './Player';

export interface FantasyTeam {
	id?: number;
	name: string;
	captainId: number;
	playerIds: number[];
	createdAt?: string;
}
