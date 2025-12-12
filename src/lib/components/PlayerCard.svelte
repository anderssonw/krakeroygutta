<script lang="ts">
	import clsx from 'clsx';
	import currency from '$lib/assets/currency.png';
	import type { PlayerInfo } from '../../routes/spillere/types';
	import TeamKit from './TeamKit.svelte';
	import { getLastName } from '$lib/names';
	import { getPlayerAverage } from '$lib/player';

	type PlayerCardSize = 'sm' | 'md' | 'lg';
	interface Props {
		player: PlayerInfo;
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

	type CardSizes = {
		width: string;
		height: string;
		avg_stats: string;
		name: string;
		stats_text: string;
		stats_value: string;
		stats_gap: string;
		currency_size: string;
		image_width: string;
	};

	const cardSizing: Record<PlayerCardSize, CardSizes> = {
		lg: {
			width: 'w-60',
			height: 'h-96',
			avg_stats: 'text-6xl',
			name: 'text-3xl',
			stats_text: 'text-xl',
			stats_value: 'text-2xl',
			stats_gap: 'gap-2.5',
			currency_size: 'w-4',
			image_width: 'w-36'
		},
		md: {
			width: 'w-40',
			height: 'h-64',
			avg_stats: 'text-4xl',
			name: 'text-xl',
			stats_text: 'text-base',
			stats_value: 'text-lg',
			stats_gap: 'gap-1',
			currency_size: 'w-3',
			image_width: 'w-24'
		},
		sm: {
			width: 'w-33',
			height: 'h-52',
			avg_stats: 'text-3xl',
			name: 'text-base',
			stats_text: 'text-xs',
			stats_value: 'text-sm',
			stats_gap: 'gap-1',
			currency_size: 'w-2',
			image_width: 'w-20'
		}
	} as const;

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

<!-- TODO Fonter er det samme overalt, må mekke noen nye fonter også -->
<div class={clsx('player-card', cardVariant, sizing.width, sizing.height, player.inform_image ? 'text-primary' : 'text-secondary')}>
	<div class="relative h-[53.2%] w-full">
		<div class="absolute top-[20%] left-[10%] flex w-1/4 flex-col items-center gap-2">
			<p class={clsx('font-semibold', sizing.avg_stats)}>{playerStatAverage}</p>
			<TeamKit color={player.team.color} />
		</div>
		<div class={clsx('absolute right-1 bottom-0', sizing.image_width)}>
			<img src={playerImage()} alt={player.name} />
		</div>
	</div>
	<div class={clsx('flex h-[47.8%] w-full flex-col items-center', sizing.stats_gap)}>
		<p class={clsx('font-semibold', sizing.name)}>{getLastName(player.name)}</p>
		<div class={clsx('flex flex-row', sizing.stats_gap)}>
			{#each stats() as stat}
				<div class="flex flex-col items-center">
					<p class={clsx('leading-none font-light -tracking-widest', sizing.stats_text)}>{stat.label}</p>
					<p class={clsx('leading-none font-semibold -tracking-widest', sizing.stats_value)}>{stat.value}</p>
				</div>
			{/each}
		</div>
		<div class={clsx('inline-flex items-center', sizing.stats_gap)}>
			<p class={clsx(sizing.stats_text, 'font-semibold')}>{player.price}</p>
			<img src={currency} alt="Currency" class={clsx(sizing.currency_size, sizing.currency_size)} />
			<p></p>
		</div>
	</div>
</div>
