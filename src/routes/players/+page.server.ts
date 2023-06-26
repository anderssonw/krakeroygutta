import type { PageServerLoad } from './$types';
import type { Player } from '$lib/types/newTypes';
import playersJson from '$lib/dummydata/players.json';

export const load: PageServerLoad<{ players: Player[]; }> = async () => {
    let players: Player[] = [];

    const dbPlayers: Player[] = playersJson; // Change with fetch from database

    players = dbPlayers;

    return { players: players }

}