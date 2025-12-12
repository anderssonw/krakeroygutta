<script lang="ts">
	import clsx from 'clsx';
	import type { BreakPoint } from '$lib/breakpoints';
	import FantasyCardActions from '../../../routes/(authenticated)/fantasy/FantasyCardActions.svelte';
	import { cardSizing } from './cardSizing';

	type PlayerCardSize = BreakPoint;
	interface Props {
		size: PlayerCardSize;
		onclick?: () => void;
	}

	let { size = 'md', onclick }: Props = $props();

	const sizing = $derived(cardSizing[size]);
</script>

<div class="flex flex-col items-center">
	<button
		class={clsx('player-card empty text-secondary', sizing.width, sizing.height, 'transition-opacity hover:opacity-80')}
		{onclick}
		disabled={!onclick}
		aria-label="Legg til spiller"
	>
	</button>
	<!-- TODO Kun for å gi samme høyde, bør kanskje gjøres på en bedre måte? -->
	<FantasyCardActions hidden={true} />
</div>
