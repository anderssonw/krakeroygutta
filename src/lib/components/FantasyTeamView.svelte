<script lang="ts">
	import type { FantasyTeam } from '$lib/types/FantasyTeam';
	import type { Player } from '$lib/types/Player';

	export let players: Player[];
	export let team: FantasyTeam;

	const playerFromId = (playerId: number) => {
		return players.find((player) => player.id == playerId);
	};
</script>

<div class="teamContainer">
	<h3>Lagnavn: {team.name}</h3>
	<div class="captain">Kaptein: {playerFromId(team.captainId)?.playerName}</div>
	{#each team.playerIds.map((id) => playerFromId(id)) as player}
		<div class="player">Spiller: {player?.playerName}</div>
	{/each}
</div>

<style>
	.teamContainer {
		background-color: #303030;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.captain {
		font-weight: bold;
	}

	.player {
		margin: 10px 0;
	}
</style>
