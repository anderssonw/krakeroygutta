import type { BreakPoint } from '$lib/breakpoints';

type CardSizes = {
	width: string;
	height: string;
	avg_stats: string;
	name: string;
	stats_text: string;
	stats_value: string;
	stats_gap: string;
	currency_size: string;
	image_width: string;
};

export const cardSizing: Record<BreakPoint, CardSizes> = {
	lg: {
		width: 'w-60',
		height: 'h-96',
		avg_stats: 'text-6xl',
		name: 'text-3xl',
		stats_text: 'text-xl',
		stats_value: 'text-2xl',
		stats_gap: 'gap-2.5',
		currency_size: 'w-4',
		image_width: 'w-36'
	},
	md: {
		width: 'w-40',
		height: 'h-64',
		avg_stats: 'text-4xl',
		name: 'text-xl',
		stats_text: 'text-base',
		stats_value: 'text-lg',
		stats_gap: 'gap-1',
		currency_size: 'w-3',
		image_width: 'w-24'
	},
	sm: {
		width: 'w-33',
		height: 'h-52',
		avg_stats: 'text-3xl',
		name: 'text-base',
		stats_text: 'text-xs',
		stats_value: 'text-sm',
		stats_gap: 'gap-1',
		currency_size: 'w-2',
		image_width: 'w-20'
	}
} as const;
