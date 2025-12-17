<script lang="ts">
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import FantasyCardActions from './FantasyCardActions.svelte';

	import { getCurrentBreakpoint } from '$lib/breakpoints';
	import type { SeasonAndTeamPlayer } from '$lib/types/player';

	type Props = {
		player: SeasonAndTeamPlayer;
		isCaptain: boolean;
		onSelect?: () => void;
		onDelete: () => void;
		onToggleCaptain: () => void;
	};

	let { player, isCaptain, onSelect, onDelete, onToggleCaptain }: Props = $props();

	const breakpoint = getCurrentBreakpoint();
</script>

<div class="flex flex-col items-center">
	<PlayerCard {player} size={breakpoint === 'lg' ? 'md' : breakpoint} />
	<FantasyCardActions {isCaptain} {onDelete} {onToggleCaptain} {onSelect} />
</div>
