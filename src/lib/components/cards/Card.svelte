<script lang="ts">
	import { goto } from '$app/navigation';
	import { CARD_SIZE, calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';
    
	export let player: FullPlayer;
    export let card_size: CARD_SIZE;

	$: playerStatAverage = calculatePlayerStatAverage(player);
    $: cardType = getPlayerCardType(player, true);
    $: cardSizing = getCardSizing();
	
    const getCardSizing = () => {
        let sizes = {
            width: sizeBasedReturn('w-60', 'w-40', 'w-28'),
            height: sizeBasedReturn('h-96', 'h-64', 'h-44'),
            avg_stats: sizeBasedReturn('text-6xl', 'text-4xl', 'text-2xl'),
            name: sizeBasedReturn('text-3xl', 'text-xl', 'text-base'),
            stats: sizeBasedReturn('text-2xl', 'text-lg', 'text-sm'),
            stats_width: sizeBasedReturn('w-[72%]', 'w-[76%]', 'w-[80%]'),
            name_gap_y: sizeBasedReturn('space-y-[6%]', 'space-y-[2%]', 'space-y-0'),
            stat_gap_y: sizeBasedReturn('space-y-[3%]', 'space-y-0', 'space-y-0'),
            gap_x: sizeBasedReturn('gap-x-8', 'gap-x-4', 'gap-x-2')
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
	<div class="clickable-card {cardType} {cardSizing.width} {cardSizing.height}" on:mouseup={() => goto(`/players/${player.id}`)}>

		<div class="relative w-full h-[53.2%]">
			<div class="{cardSizing.avg_stats} absolute top-[15%] left-[13%]">{playerStatAverage}</div>
			<div class="w-[60%] absolute bottom-0 right-[5%]">
				<img src="/profile/placeholder.png" alt="head" />
			</div>
		</div>

		<div class="relative w-full h-[46.8%]">
			<div class="w-full flex flex-col {cardSizing.name_gap_y} items-center font-medium">
				<div class="{cardSizing.name}">{player.name.split(' ')[1]}</div>
				<div class="{cardSizing.stats_width} grid grid-cols-2 {cardSizing.stat_gap_y} {cardSizing.gap_x} font-mono">
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
	<p>No player :(</p>
{/if}
