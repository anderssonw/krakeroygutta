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
		isEditable?: boolean;
		isLink?: boolean;
	}

	let { player, size = 'md', isEditable = false, isLink = false }: Props = $props();

	// Separate stat values object for editing
	let statValues = $state({
		attack: 0,
		defence: 0,
		skill: 0,
		morale: 0,
		physical: 0
	});
	let priceValue = $state(0);

	// Update stat values when player changes
	$effect(() => {
		statValues.attack = player.attack;
		statValues.defence = player.defence;
		statValues.skill = player.skill;
		statValues.morale = player.morale;
		statValues.physical = player.physical;
		priceValue = player.price;
	});

	const playerStatAverage = $derived.by(() => {
		if (isEditable) {
			const editedPlayer = {
				...player,
				attack: statValues.attack,
				defence: statValues.defence,
				skill: statValues.skill,
				morale: statValues.morale,
				physical: statValues.physical
			};

			return getPlayerAverage(editedPlayer);
		}
		return getPlayerAverage(player);
	});

	const cardVariant = $derived.by(() => {
		if (player.inform_image) return 'inform';
		if (player.outofform_image) return 'trash';

		if (playerStatAverage >= 75) return 'gold';
		if (playerStatAverage >= 65) return 'silver';
		return 'bronze';
	});

	const sizing = $derived(cardSizing[size]);

	const stats = [
		{ label: 'ANG', name: 'attack' as const },
		{ label: 'FOR', name: 'defence' as const },
		{ label: 'TEK', name: 'skill' as const },
		{ label: 'MOR', name: 'morale' as const },
		{ label: 'FYS', name: 'physical' as const }
	];

	const playerImage = $derived(() => {
		return player.inform_image ?? player.outofform_image ?? player.image;
	});
</script>

{#snippet playerCard()}
	<div class={cn('player-card', cardVariant, sizing.width, sizing.height, player.inform_image ? 'text-primary' : 'text-secondary')}>
		<div class="relative h-[53.2%] w-full">
			<div class="absolute top-[20%] left-[10%] flex w-1/4 flex-col items-center gap-2">
				<p class={cn('font-semibold', sizing.avg_stats)}>{playerStatAverage}</p>
				{#if player.team}
					<TeamKit color={player.team.color} />
				{:else}
					<div class="h-6 w-6"></div>
				{/if}
			</div>
			<div class={cn('absolute right-1 bottom-px', sizing.image_width)}>
				<img src={playerImage()} alt={player.name} />
			</div>
		</div>
		<div class={cn('flex h-[47.8%] w-full flex-col items-center', sizing.stats_gap)}>
			<p class={cn('font-semibold', sizing.name)}>{getLastName(player.name)}</p>
			<div class={cn('flex flex-row', sizing.stats_gap)}>
				{#each stats as stat}
					<div class="flex flex-col items-center">
						<p class={cn('leading-none! font-light -tracking-widest ', sizing.stats_text)}>{stat.label}</p>
						{#if isEditable}
							<input
								type="number"
								name={stat.name}
								bind:value={statValues[stat.name]}
								class={cn(
									'hide-number-spinners w-5 border-none bg-transparent text-center leading-none! font-semibold -tracking-widest',
									sizing.stats_value
								)}
							/>
						{:else}
							<p class={cn('leading-none! font-semibold -tracking-widest ', sizing.stats_value)}>{statValues[stat.name]}</p>
						{/if}
					</div>
				{/each}
			</div>
			<div class={cn('inline-flex items-center', sizing.stats_gap)}>
				{#if isEditable}
					<input
						type="number"
						name="price"
						bind:value={priceValue}
						class={cn(sizing.stats_text, 'hide-number-spinners w-10 border-none bg-transparent text-center font-semibold')}
					/>
				{:else}
					<p class={cn(sizing.stats_text, 'font-semibold')}>{priceValue}</p>
				{/if}
				<enhanced:img src={currency} alt="Currency" class={cn(sizing.currency_size, sizing.currency_size)} />
				<p></p>
			</div>
		</div>
	</div>
{/snippet}

{#if isLink}
	<a href={`/sesong/spillere/${player.id}`} class="no-underline">
		{@render playerCard()}
	</a>
{:else}
	{@render playerCard()}
{/if}
