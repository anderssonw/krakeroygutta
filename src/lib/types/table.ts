import type { Snippet } from 'svelte';

export interface TableHeader<TSortKey extends string, TData = any> {
	sortKey?: TSortKey;
	label: string;
	align?: 'left' | 'center' | 'right';
	field?: keyof TData;
	isIcon?: boolean;
	color?: string;
	abbreviation?: string;
	render?: (value: any, row: TData, index: number) => any;
	headerRender?: Snippet;
}

export type SortDirection = 1 | -1;

export type SortFunctions<TSortKey extends string, TData> = {
	[key in TSortKey]: (a: TData, b: TData) => number;
};
