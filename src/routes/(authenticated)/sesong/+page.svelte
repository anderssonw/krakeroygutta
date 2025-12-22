<script lang="ts">
	import type { PageProps } from './$types';
	import { getVisibleRoutes } from '$lib/routing';
	import SubRouteCards from '$lib/components/SubRouteCard.svelte';
	import eirikVideo from '$lib/assets/eirikComp.mp4';
	import SortableTable from '$lib/components/SortableTable.svelte';
	import type { TeamStatistics } from '$lib/types/team';
	import type { TableHeader, SortFunctions } from '$lib/types/table';
	import { cn } from '$lib/utils';

	let { data }: PageProps = $props();

	let { season, stats } = $derived(data);

	const sesongRoutes = $derived(getVisibleRoutes(data.profile).find((route) => route.href === '/sesong')?.subRoutes ?? []);

	// Team stats
	type TeamSortKey = 'name' | 'wins' | 'ties' | 'losses' | 'points';
	type TeamWithPoints = TeamStatistics & { points: number };

	const teamHeaders: TableHeader<TeamSortKey, TeamWithPoints>[] = [
		{ sortKey: 'name', label: 'Lag', align: 'left' },
		{ sortKey: 'wins', label: 'S', align: 'center' },
		{ sortKey: 'ties', label: 'U', align: 'center' },
		{ sortKey: 'losses', label: 'T', align: 'center' },
		{ sortKey: 'points', label: 'Poeng', align: 'center' }
	];

	const teamSortFunctions: SortFunctions<TeamSortKey, TeamWithPoints> = {
		name: (a, b) => a.name.localeCompare(b.name, 'nb-NO', { sensitivity: 'base' }),
		wins: (a, b) => b.wins - a.wins,
		ties: (a, b) => b.ties - a.ties,
		losses: (a, b) => b.losses - a.losses,
		points: (a, b) => b.points - a.points
	};

	const teamStatsWithPoints = $derived(stats.then((s) => s.teamStats.map((team) => ({ ...team, points: team.wins * 3 + team.ties }))));

	// Fantasy stats
	type FantasySortKey = 'name' | 'score';
	type FantasyTeamStat = { id: number; name: string; score: number };

	const fantasyHeaders: TableHeader<FantasySortKey, FantasyTeamStat>[] = [
		{ sortKey: 'name', label: 'Lag', align: 'left' },
		{ sortKey: 'score', label: 'Poeng', align: 'center' }
	];

	const fantasySortFunctions: SortFunctions<FantasySortKey, FantasyTeamStat> = {
		name: (a, b) => a.name.localeCompare(b.name, 'nb-NO', { sensitivity: 'base' }),
		score: (a, b) => b.score - a.score
	};

	const fantasyTeamStats = $derived(stats.then((s) => s.fantasyTeamStats));
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 md:px-6">
	<div class="w-full">
		<video src={eirikVideo} autoplay controls>
			<track kind="captions" />
		</video>
	</div>
	<div class="mb-8 space-y-2">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">{season.name}</h1>
		<p class="text-muted-foreground">Utforsk denne sesongen</p>
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each sesongRoutes as route}
			<SubRouteCards {route} />
		{/each}
	</div>

	<!-- Team Stats Table -->
	<div class="mt-8 md:mt-12">
		<h2 class="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">🏆 Lagstatistikk</h2>
		<SortableTable
			data={teamStatsWithPoints}
			headers={teamHeaders}
			sortFunctions={teamSortFunctions}
			defaultSortKey="points"
			includePositionColumn
			skeletonRows={3}
		>
			{#snippet renderCell(team, header)}
				<td
					class={cn(
						'px-2 py-2 text-xs md:py-4 md:text-base',
						header.align === 'center' ? 'text-center font-semibold md:px-4' : 'font-medium md:px-6',
						header.sortKey === 'points' && 'font-bold'
					)}
				>
					{#if header.sortKey === 'name'}
						<div class="flex items-center gap-2">
							<div
								class="h-3 w-3 shrink-0 rounded-full border border-border"
								style={team.color ? `background-color: ${team.color};` : ''}
							></div>
							<span class="truncate">{team.name}</span>
						</div>
					{:else if header.sortKey}
						{team[header.sortKey]}
					{/if}
				</td>
			{/snippet}
		</SortableTable>
	</div>

	<!-- Fantasy Team Stats Table -->
	<div class="mt-8 md:mt-12">
		<h2 class="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">⚡ Fantasy-lag</h2>
		<SortableTable
			data={fantasyTeamStats}
			headers={fantasyHeaders}
			sortFunctions={fantasySortFunctions}
			defaultSortKey="score"
			includePositionColumn
		>
			{#snippet renderCell(team, header)}
				<td
					class={cn(
						'px-2 py-2 text-xs md:px-6 md:py-4 md:text-base',
						header.sortKey === 'score' ? 'font-bold' : 'font-medium',
						header.align === 'right' && 'text-right',
						header.align === 'center' && 'text-center'
					)}
				>
					{#if header.sortKey}
						{team[header.sortKey]}
					{/if}
				</td>
			{/snippet}
		</SortableTable>
	</div>
</div>
