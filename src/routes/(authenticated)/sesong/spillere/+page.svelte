<script lang="ts">
	import type { PageProps } from './$types';
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import MadsSpeechBubble from '$lib/components/MadsSpeechBubble.svelte';
	import { getPlayerAverage } from '$lib/player';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto flex max-w-7xl flex-col items-center px-4 py-8">
	<h2 class="text-2xl font-bold">Spillere for sesongen</h2>
	<h3 class="mb-2 text-xl">{data.season?.name}</h3>
	<MadsSpeechBubble madsVersion="fiesta">
		<p>
			Alle spillere er vurdert relativt til ferdighetene som befinner seg i gjengen.
			<br /><br />
			Vurderingen er gjort av komiteen og trengs ikke diskuteres ytterligere.
			<br /><br />
			Ferdighetene er IKKE endelige og kan endre seg fra sesong til sesong basert på egen utvikling. Innenfor en sesong er dog ferdigheter endelige.
		</p>
	</MadsSpeechBubble>

	<div class="mt-4 flex flex-row flex-wrap justify-center gap-4 md:gap-6">
		{#await data.players then players}
			{@const sortedPlayers = [...players].sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))}
			{#each sortedPlayers as player}
				<PlayerCard {player} size="md" />
			{/each}
		{/await}
	</div>
</div>
