<script lang="ts">
	import type { PageData } from './$types';
	import Players from '$lib/components/players/Players.svelte';
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';

	import pirateMadsSrc from '$lib/assets/piratmads.png';

	// Get server data
	export let data: PageData;
	$: ({ mappedPlayers } = data);

	const speechBubbleText: string[] = [
		'Alle spillere er vurdert relativt til ferdighetene som befinner seg i gjengen.',
		'Vurderingen er gjort av komiteen og trengs ikke diskuteres ytterligere.',
		'Ferdighetene er IKKE endelige og kan endre seg fra sesong til sesong basert på egen utvikling. Innenfor en sesong er dog ferdigheter endelige'
	];
</script>

{#if mappedPlayers}
	<div class="structure px-4">
		<RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} />

		<Players players={mappedPlayers} />
	</div>
{/if}
