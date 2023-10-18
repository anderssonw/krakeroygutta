<script lang="ts">
	import type { PageData } from './$types';
	import Players from '$lib/components/players/Players.svelte';

	import madsHangLoose from '$lib/assets/speechbubble/madsBubble1.png';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import type { FullPlayer } from '$lib/types/newTypes';
	import { calculatePlayerStatAverage } from '$lib/shared/playerCardFunctions';

	// Get server data
	export let data: PageData;
	$: ({ players, season } = data);

	const speechBubbleText: string[] = [
		'Alle spillere er vurdert relativt til ferdighetene som befinner seg i gjengen.',
		'Vurderingen er gjort av komiteen og trengs ikke diskuteres ytterligere.',
		'Ferdighetene er IKKE endelige og kan endre seg fra sesong til sesong basert på egen utvikling. Innenfor en sesong er dog ferdigheter endelige'
	];

	const sortPlayers = (players: FullPlayer[]) => {
		return players.sort((a, b) => calculatePlayerStatAverage(a) - calculatePlayerStatAverage(b))
	}
</script>

{#if players}
	<div class="structure">
		<h1>Spillere</h1>
		
		<RuleSpeechBubble imageSrc={madsHangLoose} text={speechBubbleText} mirror={true} />

		<Players players={sortPlayers(players)} season={season} />
	</div>
{/if}
