<script lang="ts">
	import { goto } from '$app/navigation';
	import PlayerImageAvatar from '$lib/components/PlayerImageAvatar.svelte';
	import SortableTable from '$lib/components/SortableTable.svelte';
	import type { PageProps } from './$types';
	import clsx from 'clsx';
	import { getInitials, getLastName, getNamesExceptFirst } from '$lib/names';
	import type { SeasonPlayerFullStats } from '$lib/types/player';
	import type { StatsSortKey, StatsTableHeader } from './types';
	import type { SortFunctions } from '$lib/types/table';

	let { data }: PageProps = $props();

	// Handle season selection change
	function handleSeasonChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const seasonId = select.value;
		goto(`/statistikk?season=${seasonId}`);
	}

	const sortFunctions: SortFunctions<StatsSortKey, SeasonPlayerFullStats> = {
		points: (a, b) => b.totalScore - a.totalScore,
		goals: (a, b) => b.goals - a.goals,
		assists: (a, b) => b.assists - a.assists,
		clutches: (a, b) => b.clutches - a.clutches,
		clean_sheets: (a, b) => b.cleanSheets - a.cleanSheets,
		victories: (a, b) => b.victories - a.victories,
		name: (a, b) => getLastName(a.name).localeCompare(getLastName(b.name), 'nb-NO', { sensitivity: 'base' })
	};

	const getPlayerNameForBreakpoint = (name: string) => {
		if (typeof window === 'undefined') {
			return getInitials(name);
		}

		const isSmall = window.innerWidth < 640; // Tailwind 'sm' breakpoint

		if (isSmall) {
			return getInitials(name);
		}

		return getNamesExceptFirst(name);
	};

	const headers: StatsTableHeader[] = [
		{ sortKey: 'name', label: 'Spiller', field: 'name', color: 'white' },
		{ sortKey: 'goals', label: 'Mål', field: 'goals', color: 'green', abbreviation: 'M', isIcon: true },
		{ sortKey: 'assists', label: 'Assists', field: 'assists', color: 'cyan', abbreviation: 'A', isIcon: true },
		{ sortKey: 'clutches', label: 'C-moment', field: 'clutches', color: 'orange', abbreviation: 'C', isIcon: true },
		{ sortKey: 'clean_sheets', label: 'Clean Sheets', field: 'cleanSheets', color: 'red', abbreviation: 'CS', isIcon: true },
		{ sortKey: 'victories', label: 'Seiere', field: 'victories', color: 'red', abbreviation: 'S', isIcon: true },
		{ sortKey: 'points', label: 'Poeng', field: 'totalScore', color: 'white' }
	];
</script>

{#if !data.season}
	<div class="container mx-auto p-8">
		<h1 class="text-3xl font-bold">Ingen sesong funnet</h1>
		<p class="mt-4 text-muted-foreground">Velg en sesong for å se statistikk.</p>
	</div>
{:else}
	<div class="container mx-auto p-6 md:p-8">
		<div class="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-2xl font-bold md:text-4xl">{data.season.name}</h1>
				<p class="mt-1 text-sm text-muted-foreground md:mt-2">
					{data.season.start_time.toLocaleDateString('nb-NO')} - {data.season.end_time.toLocaleDateString('nb-NO')}
				</p>
			</div>

			<!-- Season Selector -->
			{#if data.allSeasons.length > 1}
				<div>
					<label for="season-select" class="mb-2 block text-sm font-medium">Velg sesong</label>
					<select
						id="season-select"
						onchange={handleSeasonChange}
						value={data.season.id}
						class="w-full rounded-lg border bg-card px-4 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none md:w-auto"
					>
						{#each data.allSeasons as season}
							<option value={season.id}>{season.name}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>

		<div class="mb-8 md:mb-12">
			<h2 class="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">🏆 Spillerpoeng</h2>

			<SortableTable
				data={data.players}
				{headers}
				{sortFunctions}
				defaultSortKey="points"
				getRowClass={(player) =>
					clsx(
						data.profile?.player_id === player.id &&
							'animate-pulse-subtle relative bg-primary/10 shadow-[inset_0_0_20px_oklch(var(--primary),0.15)]'
					)}
			>
				{#snippet renderCell(player, header)}
					<td class={clsx('px-2 py-2 md:px-6 md:py-4', header.isIcon && 'text-center', header.sortKey === 'points' && 'text-center')}>
						{#if header.sortKey === 'name'}
							<div class="flex items-center gap-2 sm:gap-3">
								<PlayerImageAvatar src={player.image} alt={player.name} size={'sm'} class="sm:h-10 sm:w-10" />
								<span class="sm:text-medium text-xs md:text-base">{getPlayerNameForBreakpoint(player.name)}</span>
							</div>
						{:else if header.isIcon && header.field}
							<span class={`text-sm font-semibold sm:text-base text-${header.color}-500`}>
								{player[header.field]}
							</span>
						{:else if header.field}
							<span class="sm:text-medium text-base font-bold md:text-base">{player[header.field]}</span>
						{/if}
					</td>
				{/snippet}
			</SortableTable>
		</div>
	</div>
{/if}
