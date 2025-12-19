<script lang="ts">
	import { calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer } from '$lib/types/newTypes';
	import trash_back from '$lib/assets/cards/trash_back.png';
	import { onMount } from 'svelte';

	export let playerVersions: FullPlayer[];
	export let season: Tables<'seasons'>;

	$: player = playerVersions.find((version) => version.season_id == season.id);
	$: prevPlayer = findPrevSeasonPlayer(playerVersions);

	const findPrevSeasonPlayer = (playerVersions: FullPlayer[]) => {
		const sortBySeasons = playerVersions.sort((a, b) => (b.season_id ?? 0) - (a.season_id ?? 0));
		const findCurrentSeasonIndex = sortBySeasons.findIndex((version) => version.season_id == season.id);
		const prevSeasonIndex = findCurrentSeasonIndex + 1;
		if (playerVersions.length > prevSeasonIndex) {
			return sortBySeasons[prevSeasonIndex];
		}
	};

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

	let widthDiff = 0;
	const handleImageLoad = (target: any) => {
		if (target) {
			const heightToWidthRatio = target.naturalHeight / target.naturalWidth;
			const changeBy = (1 - heightToWidthRatio) * 200;
			const changeByClamped = Math.min(Math.max(changeBy, -100), 100);
			widthDiff = changeByClamped;
		}
	};

	let imgEl: HTMLImageElement;
	onMount(() => {
		if (imgEl && imgEl.complete) {
			handleImageLoad(imgEl);
		}
	});
</script>

<div class="relative w-full h-80 {cardBackType}">
	{#if player?.outofform_image}
		<img src={trash_back} alt="head" class="w-full h-full object-contain" />
	{:else}
		<div style={`width: ${256 + widthDiff}px;`} class="absolute bottom-0 left-1/2 -translate-x-1/2">
			<img
				class="w-full"
				src={player?.inform_image ? player.inform_image : player?.image}
				alt="head"
				bind:this={imgEl}
				on:load={(e) => handleImageLoad(e.target)}
			/>
		</div>
	{/if}
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
