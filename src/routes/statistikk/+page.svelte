<script lang="ts">
	import { goto } from '$app/navigation';
	import PlayerImage from '$lib/components/PlayerImage.svelte';
	import SortableTableHeader from '$lib/components/SortableTableHeader.svelte';
	import type { PageProps } from './$types';
	import type { FullPlayerStats } from './+page.server';
	import clsx from 'clsx';

	let { data }: PageProps = $props();

	// Handle season selection change
	function handleSeasonChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const seasonId = select.value;
		goto(`/statistikk?season=${seasonId}`);
	}

	type SortKey = 'points' | 'goals' | 'assists' | 'clutches' | 'clean_sheets' | 'victories' | 'name';

	const sortFunctions: Record<SortKey, (a: FullPlayerStats, b: FullPlayerStats) => number> = {
		points: (a, b) => b.totalScore - a.totalScore,
		goals: (a, b) => b.goals - a.goals,
		assists: (a, b) => b.assists - a.assists,
		clutches: (a, b) => b.clutches - a.clutches,
		clean_sheets: (a, b) => b.cleanSheets - a.cleanSheets,
		victories: (a, b) => b.victories - a.victories,
		name: (a, b) => a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0], 'nb-NO', { sensitivity: 'base' })
	};

	let currentSortKey = $state<SortKey>('points');
	let sortDirection = $state(1); // 1 = descending, -1 = ascending

	const setSort = (sortKey: SortKey) => {
		if (currentSortKey === sortKey) {
			sortDirection = sortDirection === 1 ? -1 : 1;
		} else {
			currentSortKey = sortKey;
			sortDirection = 1;
		}
	};

	function getSortedPlayers(players: FullPlayerStats[]) {
		const sortFn = sortFunctions[currentSortKey] || sortFunctions.points;
		return [...players].sort((a, b) => sortFn(a, b) * sortDirection);
	}

	type Header = {
		sortKey: SortKey;
		label: string;
		field: keyof FullPlayerStats;
		color?: string;
		abbreviation?: string;
		isIcon?: boolean;
	};

	const getPlayerNameForBreakpoint = (name: string) => {
		const parts = name.split(' ');

		const isSmall = window.innerWidth < 640; // Tailwind 'sm' breakpoint

		if (isSmall) {
			return `${parts.slice(0)[0][0]}. ${parts.slice(-1)[0][0]}.`; // Initialer
		}

		return parts.slice(1).join(' '); // Etternavn og eventuelle mellomnavn
	};

	const headers: Header[] = [
		{ sortKey: 'name', label: 'Spiller', field: 'name' },
		{ sortKey: 'goals', label: 'Mål', field: 'goals', color: 'green', abbreviation: 'M', isIcon: true },
		{ sortKey: 'assists', label: 'Assists', field: 'assists', color: 'blue', abbreviation: 'A', isIcon: true },
		{ sortKey: 'clutches', label: 'Clutches', field: 'clutches', color: 'orange', abbreviation: 'C', isIcon: true },
		{ sortKey: 'clean_sheets', label: 'Clean Sheets', field: 'cleanSheets', color: 'red', abbreviation: 'CS', isIcon: true },
		{ sortKey: 'victories', label: 'Seiere', field: 'victories', color: 'red', abbreviation: 'S', isIcon: true },
		{ sortKey: 'points', label: 'Poeng', field: 'totalScore' }
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
						class="w-full rounded-lg border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:w-auto"
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

			<div class="overflow-x-auto rounded-lg border bg-card">
				<table class="w-full">
					<thead class="border-b bg-muted/50">
						<tr>
							{#each headers as header, _}
								<SortableTableHeader
									sortKey={header.sortKey}
									{currentSortKey}
									{sortDirection}
									onSort={setSort}
									align={header.isIcon ? 'center' : header.sortKey === 'points' ? 'center' : 'left'}
								>
									{#if header.isIcon}
										<span
											class={`inline-flex h-5 w-5 md:h-8 md:w-8 justify-center items-center rounded-full bg-${header.color}-500/20 text-xs sm:text-medium md:text-base font-bold text-${header.color}-300`}
											>{header.abbreviation}</span
										>
									{:else}
										<span class="text-xs sm:text-medium md:text-base font-bold">{header.label}</span>
									{/if}
								</SortableTableHeader>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#await data.players}
							<!-- Skeleton loader -->
							{#each Array(8) as _, i}
								<tr class="animate-pulse border-b last:border-b-0">
									{#each headers as _, j}
										<td class="px-2 py-2 md:px-6 md:py-4">
											{#if j === 0}
												<div class="flex items-center gap-2 sm:gap-3">
													<div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted"></div>
													<div class="hidden sm:block h-4 w-32 rounded bg-muted"></div>
												</div>
											{:else if j === headers.length - 1}
												<div class="ml-auto h-5 w-10 sm:h-6 sm:w-16 rounded bg-muted"></div>
											{:else}
												<div class="mx-auto h-4 w-6 sm:w-8 rounded bg-muted"></div>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						{:then players}
							<!-- Actual data -->
							{#each getSortedPlayers(players) as player, i}
								<tr class="border-b last:border-b-0 hover:bg-muted/30">
									{#each headers as header}
										<td
											class={clsx(
												`px-2 py-2 md:px-6 md:py-4`,
												header.isIcon && 'text-center',
												header.sortKey === 'points' && 'text-center'
											)}
										>
											{#if header.sortKey === 'name'}
												<div class="flex items-center gap-2 sm:gap-3">
													<PlayerImage src={player.image} alt={player.name} size={'sm'} class="sm:h-10 sm:w-10" />
													<span class="text-xs sm:text-medium md:text-base">{getPlayerNameForBreakpoint(player.name)}</span>
												</div>
											{:else if header.isIcon}
												<span class={`text-sm sm:text-base font-semibold text-${header.color}-300`}>
													{player[header.field]}
												</span>
											{:else}
												<span class="text-base sm:text-medium md:text-base font-bold">{player[header.field]}</span>
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						{:catch error}
							<!-- Error state -->
							<tr>
								<td colspan="8" class="px-6 py-8 text-center">
									<p class="text-destructive">Kunne ikke laste spillerdata: {error.message}</p>
								</td>
							</tr>
						{/await}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
