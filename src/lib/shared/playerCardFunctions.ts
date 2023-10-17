import type { FullPlayer } from "$lib/types/newTypes";

export enum CARD_SIZE {
    SMALL,
    MEDIUM,
    LARGE
}

export const calculatePlayerStatAverage = (player: FullPlayer | null) => {
    if (player) return Math.ceil((player.attack + player.defence + player.morale + player.physical + player.skill) / 5);
    else return 0;
};
export const getPlayerCardType = (player: FullPlayer | null, card: boolean) => {
    if (player) {
        let avgStats: number = calculatePlayerStatAverage(player);
        if (avgStats > 75) return card ? "gold-card" : "gold-back";
        if (avgStats > 65) return card ? "silver-card" : "silver-back";;
        return card ? "bronze-card" : "bronze-back";
    } else {
        return 'empty-card';
    }
}