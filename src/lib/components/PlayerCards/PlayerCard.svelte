<script lang="ts">
	import { cn } from '$lib/utils';
	import currency from '$lib/assets/currency.png';
	import TeamKit from '../TeamKit.svelte';
	import { getLastName } from '$lib/names';
	import { getPlayerAverage } from '$lib/player';
	import type { BreakPoint } from '$lib/breakpoints';
	import type { SeasonAndTeamPlayer } from '$lib/types/player';
	import { cardSizing } from './cardSizing';

	type PlayerCardSize = BreakPoint;
	interface Props {
		player: SeasonAndTeamPlayer;
		size: PlayerCardSize;
	}

	let { player, size = 'md' }: Props = $props();

	const playerStatAverage = $derived.by(() => {
		return getPlayerAverage(player);
	});

	const cardVariant = $derived.by(() => {
		const avg = playerStatAverage;

		if (player.inform_image) return 'inform';
		if (player.outofform_image) return 'trash';

		if (avg >= 75) return 'gold';
		if (avg >= 65) return 'silver';
		return 'bronze';
	});

	const sizing = $derived(cardSizing[size]);

	const stats = $derived(() => {
		return [
			{ label: 'ANG', value: player.attack },
			{ label: 'FOR', value: player.defence },
			{ label: 'TEK', value: player.skill },
			{ label: 'MOR', value: player.morale },
			{ label: 'FYS', value: player.physical }
		];
	});

	const playerImage = $derived(() => {
		return player.inform_image ?? player.outofform_image ?? player.image;
	});
</script>

<div class={cn('player-card', cardVariant, sizing.width, sizing.height, player.inform_image ? 'text-primary' : 'text-secondary')}>
	<div class="relative h-[53.2%] w-full">
		<div class="absolute top-[20%] left-[10%] flex w-1/4 flex-col items-center gap-2">
			<p class={cn('font-semibold', sizing.avg_stats)}>{playerStatAverage}</p>
			<TeamKit color={player.team.color} />
		</div>
		<div class={cn('absolute right-1 bottom-px', sizing.image_width)}>
			<img src={playerImage()} alt={player.name} />
		</div>
	</div>
	<div class={cn('flex h-[47.8%] w-full flex-col items-center', sizing.stats_gap)}>
		<p class={cn('font-semibold', sizing.name)}>{getLastName(player.name)}</p>
		<div class={cn('flex flex-row', sizing.stats_gap)}>
			{#each stats() as stat}
				<div class="flex flex-col items-center">
					<p class={cn('leading-none! font-light -tracking-widest ', sizing.stats_text)}>{stat.label}</p>
					<p class={cn('leading-none! font-semibold -tracking-widest ', sizing.stats_value)}>{stat.value}</p>
				</div>
			{/each}
		</div>
		<div class={cn('inline-flex items-center', sizing.stats_gap)}>
			<p class={cn(sizing.stats_text, 'font-semibold')}>{player.price}</p>
			<enhanced:img src={currency} alt="Currency" class={cn(sizing.currency_size, sizing.currency_size)} />
			<p></p>
		</div>
	</div>
</div>
