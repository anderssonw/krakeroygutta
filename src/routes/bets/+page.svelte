<script lang="ts">
	import type { PageData } from './$types';
	import Players from '$lib/components/players/Players.svelte';
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';

	import pirateMadsSrc from '$lib/assets/piratmads.png';

	const speechBubbleText: string[] = [
		'Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.',
		'De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.',
		'Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.'
	];
</script>

<div class="structure">
    <h1> Bets </h1>
    <RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} mirror={true} />
</div>
