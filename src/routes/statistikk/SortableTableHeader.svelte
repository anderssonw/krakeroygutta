<script lang="ts">
	import clsx from 'clsx';
	import type { SortKey } from './types';
	import type { Snippet } from 'svelte';

	interface Props {
		sortKey?: SortKey;
		currentSortKey: SortKey;
		sortDirection: number;
		onSort?: (sortKey: SortKey) => void;
		align?: 'left' | 'center' | 'right';
		children: Snippet;
	}

	let { sortKey, currentSortKey, sortDirection, onSort, align = 'left', children }: Props = $props();

	const isSortable = $derived(sortKey !== undefined);
	const isActive = $derived(sortKey === currentSortKey);
	const alignClass = $derived(align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left');
	const showIndicator = $derived(isSortable && isActive);

	const handleClick = () => {
		if (isSortable && sortKey && onSort) {
			onSort(sortKey);
		}
	};
</script>

<th
	onclick={handleClick}
	class={clsx('px-2 py-2 md:px-6 md:py-4 text-sm font-semibold select-none', alignClass, isSortable && 'cursor-pointer hover:bg-muted/50')}
>
	<div class="inline-flex items-center gap-1">
		{#if children}
			{@render children()}
		{/if}
		{#if showIndicator}
			<span>{sortDirection === 1 ? '↓' : '↑'}</span>
		{/if}
	</div>
</th>
