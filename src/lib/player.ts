import type { SeasonAndTeamPlayer } from './types/player';

export const getPlayerAverage = (player: SeasonAndTeamPlayer): number => {
	const stats = [player.attack, player.defence, player.morale, player.physical, player.skill];
	const total = stats.reduce((sum: number, stat: number) => sum + stat, 0);
	return Number((total / stats.length).toFixed(0));
};
