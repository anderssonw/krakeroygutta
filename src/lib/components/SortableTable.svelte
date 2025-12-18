<script lang="ts" generics="TSortKey extends string, TData">
	import type { Snippet } from 'svelte';
	import SortableTableHeader from './SortableTableHeader.svelte';
	import TableSkeleton from './TableSkeleton.svelte';
	import type { TableHeader, SortFunctions } from '$lib/types/table';
	import { createTableSort } from '$lib/utils/tableSort.svelte';
	import clsx from 'clsx';

	interface Props {
		data: Promise<TData[]> | TData[];
		headers: TableHeader<TSortKey, TData>[];
		sortFunctions: SortFunctions<TSortKey, TData>;
		defaultSortKey: TSortKey;
		defaultSortDirection?: 1 | -1;
		renderCell: Snippet<[TData, TableHeader<TSortKey, TData>, number]>;
		getRowClass?: (row: TData, index: number) => string;
		includePositionColumn?: boolean;
		emptyMessage?: string;
		skeletonRows?: number;
	}

	let {
		data,
		headers,
		sortFunctions,
		defaultSortKey,
		defaultSortDirection = 1,
		renderCell,
		getRowClass,
		includePositionColumn = false,
		emptyMessage = 'Ingen data tilgjengelig',
		skeletonRows = 8
	}: Props = $props();

	const sortManager = $derived(createTableSort(defaultSortKey, sortFunctions, defaultSortDirection));

	const isPromise = (value: any): value is Promise<TData[]> => {
		return value && typeof value.then === 'function';
	};
</script>

<div class="overflow-x-auto rounded-lg border bg-card">
	<table class="w-full">
		<thead class="border-b bg-muted/50">
			<tr>
				{#if includePositionColumn}
					<SortableTableHeader currentSortKey={sortManager.currentSortKey} sortDirection={sortManager.sortDirection} align="left">
						<span class="text-xs font-bold md:text-base">Pos</span>
					</SortableTableHeader>
				{/if}
				{#each headers as header}
					<SortableTableHeader
						sortKey={header.sortKey}
						currentSortKey={sortManager.currentSortKey}
						sortDirection={sortManager.sortDirection}
						onSort={sortManager.setSort}
						align={header.align}
					>
						{#if header.headerRender}
							{@render header.headerRender()}
						{:else if header.isIcon}
							<span
								class={clsx(
									'inline-flex h-5 w-5 items-center justify-center rounded-full md:h-8 md:w-8',
									`bg-${header.color}-500/30`,
									'sm:text-medium text-xs font-bold md:text-base'
								)}
							>
								{header.abbreviation}
							</span>
						{:else}
							<span class="sm:text-medium text-xs font-bold md:text-base">{header.label}</span>
						{/if}
					</SortableTableHeader>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if isPromise(data)}
				{#await data}
					<TableSkeleton columns={headers.length} {includePositionColumn} rows={skeletonRows} />
				{:then resolvedData}
					{#if resolvedData.length === 0}
						<tr>
							<td colspan={headers.length + (includePositionColumn ? 1 : 0)} class="px-6 py-8 text-center">
								<p class="text-muted-foreground">{emptyMessage}</p>
							</td>
						</tr>
					{:else}
						{@const sortedData = sortManager.getSortedData(resolvedData)}
						{#each sortedData as row, index}
							<tr class={clsx('border-b last:border-b-0 hover:bg-muted/30', getRowClass?.(row, index))}>
								{#if includePositionColumn}
									<td class="px-2 py-2 text-xs font-medium md:px-6 md:py-4 md:text-base">{index + 1}</td>
								{/if}
								{#each headers as header}
									{@render renderCell(row, header, index)}
								{/each}
							</tr>
						{/each}
					{/if}
				{:catch error}
					<tr>
						<td colspan={headers.length + (includePositionColumn ? 1 : 0)} class="px-6 py-8 text-center">
							<p class="text-destructive">Kunne ikke laste data: {error.message}</p>
						</td>
					</tr>
				{/await}
			{:else if data.length === 0}
				<tr>
					<td colspan={headers.length + (includePositionColumn ? 1 : 0)} class="px-6 py-8 text-center">
						<p class="text-muted-foreground">{emptyMessage}</p>
					</td>
				</tr>
			{:else}
				{@const sortedData = sortManager.getSortedData(data)}
				{#each sortedData as row, index}
					<tr class={clsx('border-b last:border-b-0 hover:bg-muted/30', getRowClass?.(row, index))}>
						{#if includePositionColumn}
							<td class="px-2 py-2 text-xs font-medium md:px-6 md:py-4 md:text-base">{index + 1}</td>
						{/if}
						{#each headers as header}
							{@render renderCell(row, header, index)}
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
