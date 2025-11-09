<script lang="ts">
	import { CARD_SIZE, calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';
	import TeamKit from '../common/TeamKit.svelte';
	import currencyImg from '$lib/assets/currency.png';
	import { onMount } from 'svelte';

	export let player: FullPlayer | null;
	export let card_size: CARD_SIZE;

	$: playerStatAverage = calculatePlayerStatAverage(player);
	$: cardType = getPlayerCardType(player, true);
	$: cardSizing = getCardSizing();

	const getCardSizing = () => {
		let sizes = {
			width: sizeBasedReturn('w-60', 'w-40', 'w-33'),
			height: sizeBasedReturn('h-96', 'h-64', 'h-52'),
			avg_stats: sizeBasedReturn('text-6xl', 'text-4xl', 'text-3xl'),
			name: sizeBasedReturn('text-3xl', 'text-xl', 'text-base'),
			stats_text: sizeBasedReturn('text-xl', 'text-base', 'text-xl'),
			stats_value: sizeBasedReturn('text-2xl', 'text-lg', 'text-sm'),
			stat_gap_y: sizeBasedReturn('space-y-[7%]', 'space-y-[5%]', 'space-y-[4%]'),
			stat_gap_x: sizeBasedReturn('gap-x-4', 'gap-x-1.5', 'gap-x-1'),
			header_gap_y: sizeBasedReturn('gap-y-6', 'gap-y-3', 'gap-y-2'),
			currency_size: sizeBasedReturn('w-4', 'w-3', 'w-2'),
			currency_space_y: sizeBasedReturn('pt-3', 'pt-0.5', 'pt-0.5'),
			image_width: sizeBasedReturn(140, 100, 80)
		};
		return sizes;
	};
	const sizeBasedReturn = (large_opt: any, medium_opt: any, small_opt: any) => {
		if (card_size == CARD_SIZE.LARGE) return large_opt;
		if (card_size == CARD_SIZE.MEDIUM) return medium_opt;
		return small_opt;
	};
	const getLastName = (player: FullPlayer) => {
		const lastName = player.name.split(' ')[1];
		return lastName.split('-')[0];
	};

	let widthDiff = 0;
	const handleImageLoad = (target: any) => {
		if (target) {
			const heightToWidthRatio = target.naturalHeight / target.naturalWidth;
			const changeBy = (1 - heightToWidthRatio) * 100;
			const changeByClamped = Math.min(Math.max(changeBy, -20), 20);
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

{#if player}
	<div class="{cardType} {cardSizing.width} {cardSizing.height} {player.inform_image ? 'text-tertiary-color' : 'text-primary-color'}">
		<div class="relative w-full h-[53.2%]">
			<div
				style={`width: ${cardSizing.image_width + widthDiff}px;`}
				class="right-[5%] absolute {card_size === CARD_SIZE.SMALL ? 'bottom-[1px]' : 'bottom-0'} flex flex-col items-center"
			>
				<img
					bind:this={imgEl}
					src={player.outofform_image ? player.outofform_image : player.inform_image ? player.inform_image : player.image}
					class={`w-full ${player.outofform_image ? 'grayscale-[0.75]' : 'grayscale-0'}`}
					alt="head"
					on:load={(e) => handleImageLoad(e.target)}
				/>
			</div>

			<div class="absolute top-[20%] left-[10%] w-[25%] flex flex-col items-center {cardSizing.header_gap_y}">
				<div class="{cardSizing.avg_stats} font-stats">{playerStatAverage}</div>
				{#if player.team_color}
					<TeamKit color={player.team_color} />
				{/if}
			</div>
		</div>

		<div class="relative w-full h-[46.8%]">
			<div class="w-full flex flex-col items-center {cardSizing.stat_gap_y}">
				<div class="{cardSizing.name} font-semibold">{getLastName(player)}</div>

				<div class="grid grid-cols-5 {cardSizing.stat_gap_x}">
					<div class="flex flex-col items-center">
						<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">ANG</div>
						<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">{player.attack}</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">FOR</div>
						<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">{player.defence}</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">TEK</div>
						<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">{player.skill}</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">MOR</div>
						<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">{player.morale}</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">FYS</div>
						<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">{player.physical}</div>
					</div>
				</div>
			</div>

			{#if player.price}
				<div class="flex flex-row items-center justify-center space-x-1 {cardSizing.currency_space_y}">
					<div class="font-stats tracking-[-.05em] font-bold {cardSizing.stats_value}">
						{player.price}
					</div>
					<div class={cardSizing.currency_size}>
						<img src={currencyImg} alt="currency" />
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="{cardType} {cardSizing.width} {cardSizing.height}" />
{/if}
