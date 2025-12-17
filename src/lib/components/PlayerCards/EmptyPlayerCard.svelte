<script lang="ts">
	import clsx from 'clsx';
	import { getCurrentBreakpoint, type BreakPoint } from '$lib/breakpoints';
	import { cardSizing } from './cardSizing';

	type PlayerCardSize = BreakPoint;
	interface Props {
		size?: PlayerCardSize;
		onclick?: () => void;
	}

	let { size, onclick }: Props = $props();

	const breakpoint = getCurrentBreakpoint();

	// Synes lg er veldig svær som default, så bruker det bare hvis du sender inn lg
	const resolvedSize = $derived((size ?? breakpoint === 'lg') ? 'md' : breakpoint);

	const sizing = $derived(cardSizing[resolvedSize]);
</script>

<div class="flex flex-col items-center">
	<button
		class={clsx('player-card empty text-secondary', sizing.width, sizing.height, 'transition-opacity hover:opacity-80')}
		{onclick}
		disabled={!onclick}
		aria-label="Legg til spiller"
	>
	</button>

	<span class="h-9"></span>
</div>
