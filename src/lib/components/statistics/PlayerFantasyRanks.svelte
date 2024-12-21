<script lang="ts">
	import PlayerStatisticCard from '$lib/components/statistics/PlayerStatisticCard.svelte';
	import PlayerStatisticCardGroup from '$lib/components/statistics/PlayerStatisticCardGroup.svelte';
	import type { PlayerStatsSeasonSummary } from '$lib/types/newTypes';

    export let fantasyTeamPlayers: { id: number; players: {player_id: number; }[] }[];
    export let allPlayerStatistics: PlayerStatsSeasonSummary[];

	const getPlayerSelections = (teams: { id: number; players: {player_id: number; }[] }[], players: PlayerStatsSeasonSummary[]) => {
		let playerMap: number[] = [];

		players.forEach((player) => (playerMap[player.player_id - 1] = 0));

		teams.forEach((team) => {
			team.players.forEach((player) => {
				playerMap[player.player_id - 1]++;
			});
		});

		return playerMap.map((selections, index) => {
			let player = players?.find((player) => player.player_id === index + 1);

			return {
				selections,
				player: {
					name: player?.player_name,
					image: player?.player_image
				}
			};
		});
	};

	function getMostSelectedPlayers(teams: { id: number; players: {player_id: number; }[] }[], players: PlayerStatsSeasonSummary[]) {
		let playerSelections = getPlayerSelections(teams, players);

		return playerSelections.sort((a, b) => b.selections - a.selections).slice(0, 3);
	}

	function getLeastSelectedPlayers(teams: { id: number; players: {player_id: number; }[] }[], players: PlayerStatsSeasonSummary[]) {
		let playerSelections = getPlayerSelections(teams, players);

		return playerSelections.sort((a, b) => a.selections - b.selections).slice(0, 3);
	}
</script>

<div class="flex flex-row flex-wrap">
    <PlayerStatisticCardGroup title="Mest valgte spillere 😍🍆💦">
        {#each getMostSelectedPlayers(fantasyTeamPlayers, allPlayerStatistics) as player, index}
            <PlayerStatisticCard
                playerName={player.player.name}
                playerSubtitle={`Valgt ${player.selections} ${player.selections === 1 ? 'gang' : 'ganger'}`}
                imgSrc={player.player.image}
                imgAlt={player.player.name}
                position={index + 1}
            />
        {/each}
    </PlayerStatisticCardGroup>
    <PlayerStatisticCardGroup title="Minst valgte spillere 😩😰">
        {#each getLeastSelectedPlayers(fantasyTeamPlayers, allPlayerStatistics) as player, index}
            <PlayerStatisticCard
                playerName={player.player.name}
                playerSubtitle={`Valgt ${player.selections} ${player.selections === 1 ? 'gang' : 'ganger'}`}
                imgSrc={player.player.image}
                imgAlt={player.player.name}
                position={index + 1}
            />
        {/each}
    </PlayerStatisticCardGroup>
</div>