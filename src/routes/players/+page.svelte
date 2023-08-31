<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import Players from '$lib/components/players/Players.svelte';
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';

	import pirateMadsSrc from '$lib/assets/piratmads.png';

	// Get server data
	export let data: PageData;
	$: ({ session, mappedPlayers } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});

	const speechBubbleText: string[] = [
		'Alle spillere er vurdert relativt til ferdighetene som befinner seg i gjengen.',
		'Vurderingen er gjort av komiteen og trengs ikke diskuteres ytterligere.',
		'Ferdighetene er IKKE endelige og kan endre seg fra sesong til sesong basert på egen utvikling. Innenfor en sesong er dog ferdigheter endelige'
	];
</script>

{#if session && mappedPlayers}
	<div class="structure px-4">
		<RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} />

		<Players players={mappedPlayers} />
	</div>
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
