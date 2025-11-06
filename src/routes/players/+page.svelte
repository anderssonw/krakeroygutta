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
		return players.sort((a, b) => calculatePlayerStatAverage(a) - calculatePlayerStatAverage(b));
	};
</script>

{#if players}
	<div class="structure">
		<h1>Spillere</h1>

		<RuleSpeechBubble imageSrc={madsHangLoose} text={speechBubbleText} mirror={true} />

		{#if sortPlayers(players).length > 0}
			<Players players={sortPlayers(players)} {season} />
		{:else}
			<div class="p-8 tablet:p-4 laptop:p-0">
				<h5>Spillere for denne sesongen er foreløpig ikke tildelt ett lag, og er derfor ikke tilgjengelige.</h5>
				<h5>Spillerne vil være tilgjengelige så snart de rettferdige lagene er blitt satt opp av julebordskomiteen</h5>
			</div>
		{/if}
	</div>
{/if}
