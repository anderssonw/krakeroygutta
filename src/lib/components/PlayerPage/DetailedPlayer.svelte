<script lang="ts">
	import { getPlayerAverage } from '$lib/player';
	import type { SeasonAndTeamPlayer } from '$lib/types/player';
	import { cn } from '$lib/utils';

	interface Props {
		player: SeasonAndTeamPlayer;
		previousPlayer: SeasonAndTeamPlayer | null;
	}

	let { player, previousPlayer }: Props = $props();

	const cardType = $derived.by(() => {
		if (player.inform_image) return 'inform-back';
		if (player.outofform_image) return 'trash-back';
		if (player.icon_image) return 'icon-back';

		const average = getPlayerAverage(player);
		if (average >= 75) return 'gold-back';
		if (average >= 65) return 'silver-back';
		return 'bronze-back';
	});

	const image = $derived(player.icon_image ?? player.inform_image ?? player.outofform_image ?? player.image);

	const stats = [
		{ label: 'Angrep', key: 'attack' },
		{ label: 'Forsvar', key: 'defence' },
		{ label: 'Teknikk', key: 'skill' },
		{ label: 'Fysikk', key: 'physical' },
		{ label: 'Moral', key: 'morale' }
	] as const;

	function statDifference(key: (typeof stats)[number]['key']): string {
		if (!previousPlayer) return '';

		const difference = player[key] - previousPlayer[key];
		return difference >= 0 ? `+${difference}` : `${difference}`;
	}
</script>

<div class="flex w-full flex-col items-center">
	{#if cardType === 'trash-back'}
		<div class={cn('tablet:h-80 laptop:h-96 relative flex h-64 w-full items-end justify-center')}>
			<div
				class={cn('player-card aspect-[1584/1035] w-full max-w-[400px] bg-center bg-no-repeat', cardType)}
				style="background-size: contain"
			></div>
		</div>
	{:else}
		<div class={cn('player-card tablet:h-80 laptop:h-96 relative h-64 w-full bg-cover bg-center bg-no-repeat', cardType)}>
			<div
				class={cn(
					'absolute bottom-0 left-1/2 -translate-x-1/2',
					player.inform_image ? 'tablet:w-48 laptop:w-60 w-40' : 'tablet:w-64 laptop:w-80 w-54'
				)}
			>
				<img src={image} alt={player.name} />
			</div>
		</div>
	{/if}

	<div
		class="border-secondary-light tablet:space-y-4 tablet:p-8 laptop:space-y-6 laptop:rounded-lg laptop:border-4 laptop:p-12 flex w-full flex-col items-center space-y-2 p-4"
	>
		<h1 class="text-2xl font-bold">{player.name}</h1>
		<h3>Pris: {player.price}</h3>

		<div class="tablet:w-2/3 tablet:space-y-4 laptop:space-y-6 flex w-full flex-col items-center space-y-2">
			{#each stats as stat (stat.key)}
				<div class="flex w-full flex-row items-center border-b-2">
					<h3 class="grow">{stat.label}</h3>
					<h3 class="grow text-end">{player[stat.key]}</h3>
					<h5>{statDifference(stat.key)}</h5>
				</div>
			{/each}
			<h3>Total: {getPlayerAverage(player)}</h3>
		</div>
	</div>
</div>
