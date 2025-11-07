<script lang="ts">
	import { calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer } from '$lib/types/newTypes';

	export let playerVersions: FullPlayer[];
	export let season: Tables<'seasons'>;

	$: player = playerVersions.find((version) => version.season_id == season.id);
	$: prevPlayer = playerVersions.find((version) => version.season_id == season.id - 1);

	const diff = (stat: number) => {
		if (stat >= 0) {
			return '+';
		}
		return '';
	};

	const attackDiff = () => {
		if (player && prevPlayer) {
			return diff(player.attack - prevPlayer.attack) + (player.attack - prevPlayer.attack).toString();
		}
		return '';
	};

	const defenceDiff = () => {
		if (player && prevPlayer) {
			return diff(player.defence - prevPlayer.defence) + (player.defence - prevPlayer.defence).toString();
		}
		return '';
	};

	const skillDiff = () => {
		if (player && prevPlayer) {
			return diff(player.skill - prevPlayer.skill) + (player.skill - prevPlayer.skill).toString();
		}
		return '';
	};

	const physicalDiff = () => {
		if (player && prevPlayer) {
			return diff(player.physical - prevPlayer.physical) + (player.physical - prevPlayer.physical).toString();
		}
		return '';
	};

	const moraleDiff = () => {
		if (player && prevPlayer) {
			return diff(player.morale - prevPlayer.morale) + (player.morale - prevPlayer.morale).toString();
		}
		return '';
	};

	const priceDiff = () => {
		if (player && prevPlayer) {
			if (player.price && prevPlayer.price) {
				return diff(player.price - prevPlayer.price) + (player.price - prevPlayer.price).toString();
			}
		}
		return '';
	};

	const totalDiff = () => {
		if (player && prevPlayer) {
			const current = calculatePlayerStatAverage(player ?? null);
			const old = calculatePlayerStatAverage(prevPlayer ?? null);
			return diff(current - old) + (current - old).toString();
		}
		return '';
	};

	$: cardBackType = getPlayerCardType(player ?? null, false);
</script>

<div class="relative w-full h-64 tablet:h-80 laptop:h-96 {cardBackType}">
	<div
		class="{player?.inform_image
			? 'w-40 tablet:w-48 laptop:w-60'
			: 'w-54 tablet:w-64 laptop:w-80'} absolute bottom-0 left-1/2 -translate-x-1/2"
	>
		<img src={player?.inform_image ? player.inform_image : player?.image} alt="head" />
	</div>
</div>

<div
	class="w-full flex flex-col items-center
	space-y-2 tablet:space-y-4 laptop:space-y-6
	p-4 tablet:p-8 laptop:p-12
	border-y-4 laptop:border-4 border-secondary-light laptop:rounded-lg"
>
	<h1>{player?.name}</h1>
	<div class="flex flex-row items-center gap-1">
		<h3>Pris: {player?.price}</h3>
		<h5>{priceDiff()}</h5>
	</div>

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
		<div class="flex flex-row items-center gap-1">
			<h3>Total: {calculatePlayerStatAverage(player ?? null)}</h3>
			<h5>{totalDiff()}</h5>
		</div>
	</div>
</div>
