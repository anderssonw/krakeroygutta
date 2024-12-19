<script lang="ts">
	import { calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';

	export let player: FullPlayer;
	export let prevPlayer: FullPlayer | null;

	const diff = (stat: number) => {
		if (stat >= 0) {
			return '+'
		} 
		return ''
	}

	const attackDiff = () => {
		if (prevPlayer) {
			return diff(player.attack - prevPlayer.attack) + (player.attack - prevPlayer.attack).toString();
		}
	}

	const defenceDiff = () => {
		if (prevPlayer) {
			return diff(player.defence - prevPlayer.defence) + (player.defence - prevPlayer.defence).toString();
		}
	}

	const skillDiff = () => {
		if (prevPlayer) {
			return diff(player.skill - prevPlayer.skill) + (player.skill - prevPlayer.skill).toString();
		}
	}

	const physicalDiff = () => {
		if (prevPlayer) {
			return diff(player.physical - prevPlayer.physical) + (player.physical - prevPlayer.physical).toString();
		}
	}

	const moraleDiff = () => {
		if (prevPlayer) {
			return diff(player.morale - prevPlayer.morale) + (player.morale - prevPlayer.morale).toString();
		}
	}

	$: cardBackType = getPlayerCardType(player, false);
</script>

<div class="relative w-full h-64 tablet:h-80 laptop:h-96 {cardBackType}">
	<div class="{player.inform_image ? 'w-40 tablet:w-48 laptop:w-60' : 'w-54 tablet:w-64 laptop:w-80'} absolute bottom-0 left-1/2 -translate-x-1/2">
		<img src={player.inform_image ? player.inform_image : player.image} alt="head" />
	</div>
</div>

<div
	class="w-full flex flex-col items-center
	space-y-2 tablet:space-y-4 laptop:space-y-6
	p-4 tablet:p-8 laptop:p-12
	border-y-4 laptop:border-4 border-secondary-light laptop:rounded-lg"
>
	<h1>{player?.name}</h1>
	<h3>Pris: {player?.price}</h3>

	<div class="w-2/3 flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6">
		<div class="w-full flex flex-row border-b-2 items-center">
			<h3 class="grow">Angrep</h3>
			<h3 class="grow text-end">{player?.attack}</h3>
			<h5>{attackDiff()}</h5>
		</div>
		<div class="w-full flex flex-row border-b-2 items-center">
			<h3 class="grow">Forsvar</h3>
			<h3 class="grow text-end">{player?.defence}</h3>
			<h5>{defenceDiff()}</h5>
		</div>
		<div class="w-full flex flex-row border-b-2 items-center">
			<h3 class="grow">Teknikk</h3>
			<h3 class="grow text-end">{player?.skill}</h3>
			<h5>{skillDiff()}</h5>
		</div>
		<div class="w-full flex flex-row border-b-2 items-center">
			<h3 class="grow">Fysikk</h3>
			<h3 class="grow text-end">{player?.physical}</h3>
			<h5>{physicalDiff()}</h5>
		</div>
		<div class="w-full flex flex-row border-b-2 items-center">
			<h3 class="grow">Moral</h3>
			<h3 class="grow text-end">{player?.morale}</h3>
			<h5>{moraleDiff()}</h5>
		</div>
		<h3>Total: {calculatePlayerStatAverage(player)}</h3>
	</div>
</div>
