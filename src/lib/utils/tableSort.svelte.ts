import type { SortDirection, SortFunctions } from '$lib/types/table';

/**
 * Creates a reusable table sorting state manager
 * @param defaultSortKey - The initial sort key
 * @param sortFunctions - Record of sort functions for each sortable column
 * @param defaultDirection - Initial sort direction (1 = descending, -1 = ascending)
 */
export function createTableSort<TSortKey extends string, TData>(
	defaultSortKey: TSortKey,
	sortFunctions: SortFunctions<TSortKey, TData>,
	defaultDirection: SortDirection = 1
) {
	let currentSortKey = $state<TSortKey>(defaultSortKey);
	let sortDirection = $state<SortDirection>(defaultDirection);

	const setSort = (sortKey: TSortKey) => {
		if (currentSortKey === sortKey) {
			sortDirection = sortDirection === 1 ? -1 : 1;
		} else {
			currentSortKey = sortKey;
			sortDirection = defaultDirection;
		}
	};

	const getSortedData = (data: TData[]): TData[] => {
		const sortFn = sortFunctions[currentSortKey] || sortFunctions[defaultSortKey];
		if (!sortFn) return data;
		return [...data].sort((a, b) => sortFn(a, b) * sortDirection);
	};

	return {
		get currentSortKey() {
			return currentSortKey;
		},
		get sortDirection() {
			return sortDirection;
		},
		setSort,
		getSortedData
	};
}
