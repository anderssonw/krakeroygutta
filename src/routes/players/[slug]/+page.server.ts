import type { PageServerLoad } from './$types';
import type { Player } from '$lib/types/newTypes';
import playersJson from '$lib/dummydata/players.json';

export const load: PageServerLoad<{ player: Player | null; }> = async (event) => {
    let players: Player[] = [];
    const dbPlayers: Player[] = playersJson; // Change with fetch from database

    let player: Player | null;
    let playerID: number = parseInt(event.params.slug);
    player = dbPlayers.filter(p => p.PlayerID == playerID)[0];

    return { player: player }

}