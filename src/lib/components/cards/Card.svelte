<script lang="ts">
	import { CARD_SIZE, calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer } from '$lib/types/newTypes';
	import TeamKit from '../common/TeamKit.svelte';
	import placeholderImg from '$lib/assets/cards/Placeholder.png';
    
	export let player: FullPlayer | null;
    export let card_size: CARD_SIZE;
	export let season: Tables<'seasons'> | null;

	$: playerStatAverage = calculatePlayerStatAverage(player);
    $: cardType = getPlayerCardType(player, true);
    $: cardSizing = getCardSizing();
	
    const getCardSizing = () => {
        let sizes = {
            width: sizeBasedReturn('w-60', 'w-40', 'w-33'),
            height: sizeBasedReturn('h-96', 'h-64', 'h-52'),
            avg_stats: sizeBasedReturn('text-6xl', 'text-4xl', 'text-2xl'),
            name: sizeBasedReturn('text-3xl', 'text-xl', 'text-base'),
            stats: sizeBasedReturn('text-2xl', 'text-lg', 'text-sm'),
            stats_width: sizeBasedReturn('w-[72%]', 'w-[76%]', 'w-[80%]'),
            name_gap_y: sizeBasedReturn('space-y-[6%]', 'space-y-[2%]', 'space-y-[2%]'),
            stat_gap_y: sizeBasedReturn('space-y-[3%]', 'space-y-0', 'space-y-0'),
            stat_gap_x: sizeBasedReturn('gap-x-8', 'gap-x-4', 'gap-x-4'),
			header_gap_y: sizeBasedReturn('gap-y-2', 'gap-y-1', 'gap-y-0.5')
        }
        return sizes;
    }
    const sizeBasedReturn = (large_opt: any, medium_opt: any, small_opt: any) => {
        if (card_size == CARD_SIZE.LARGE) return large_opt;
        if (card_size == CARD_SIZE.MEDIUM) return medium_opt;
        return small_opt;
    }
</script>

{#if player}
	<div class="{cardType} {cardSizing.width} {cardSizing.height} text-primary-color">

		<div class="relative w-full h-[53.2%]">
			<div class="absolute top-[15%] left-[13%] w-[25%] flex flex-col items-center {cardSizing.header_gap_y}">
				<div class="{cardSizing.avg_stats}">{playerStatAverage}</div>
				{#if season}
					<TeamKit color="green" />
					<div class="{cardSizing.stats}">5000,-</div>
				{/if}
			</div>
			<div class="w-[50%] absolute bottom-0 right-[5%]">
				<img src={placeholderImg} alt="head" />
			</div>
		</div>

		<div class="relative w-full h-[46.8%]">
			<div class="w-full flex flex-col {cardSizing.name_gap_y} items-center font-medium">
				<div class="{cardSizing.name}">{player.name.split(' ')[1]}</div>
				<div class="{cardSizing.stats_width} grid grid-cols-2 {cardSizing.stat_gap_y} {cardSizing.stat_gap_x} font-mono">
					<div class="w-full flex flex-row justify-between">
						<div class="{cardSizing.stats} font-bold">{player.attack}</div>
						<div class="{cardSizing.stats}">ANG</div>
					</div>
					<div class="w-full flex flex-row justify-between">
						<div class="{cardSizing.stats} font-bold">{player.physical}</div>
						<div class="{cardSizing.stats}">FYS</div>
					</div>
					<div class="w-full flex flex-row justify-between">
						<div class="{cardSizing.stats} font-bold">{player.defence}</div>
						<div class="{cardSizing.stats}">FOR</div>
					</div>
					<div class="w-full flex flex-row justify-between">
						<div class="{cardSizing.stats} font-bold">{player.morale}</div>
						<div class="{cardSizing.stats}">MOR</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="{cardType} {cardSizing.width} {cardSizing.height}">
	</div>
{/if}
