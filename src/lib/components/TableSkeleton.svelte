<script lang="ts">
	interface Props {
		columns: number;
		rows?: number;
		includePositionColumn?: boolean;
	}

	let { columns, rows = 8, includePositionColumn = false }: Props = $props();
</script>

{#each Array(rows) as _}
	<tr class="animate-pulse border-b last:border-b-0">
		{#if includePositionColumn}
			<td class="px-2 py-2 md:px-6 md:py-4">
				<div class="h-4 w-6 rounded bg-muted"></div>
			</td>
		{/if}
		{#each Array(columns - (includePositionColumn ? 1 : 0)) as _, colIndex}
			<td class="px-2 py-2 md:px-6 md:py-4">
				{#if colIndex === 0 && !includePositionColumn}
					<!-- First column with avatar -->
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="h-8 w-8 rounded-full bg-muted sm:h-10 sm:w-10"></div>
						<div class="hidden h-4 w-32 rounded bg-muted sm:block"></div>
					</div>
				{:else if colIndex === columns - (includePositionColumn ? 2 : 1)}
					<!-- Last column - typically points/score -->
					<div class="ml-auto h-5 w-10 rounded bg-muted sm:h-6 sm:w-16"></div>
				{:else}
					<!-- Regular columns -->
					<div class="mx-auto h-4 w-6 rounded bg-muted sm:w-8"></div>
				{/if}
			</td>
		{/each}
	</tr>
{/each}
