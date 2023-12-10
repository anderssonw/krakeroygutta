<script lang="ts">
	import { mapTeamStats } from '$lib/shared/MatchStatsFunctions';
	import type { PageData } from './$types';
	import madsSeriosSrc from '$lib/assets/speechbubble/madsBubble4.png';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import MatchCard from '$lib/components/matches/MatchCard.svelte';

	// Get server data
	export let data: PageData;
	$: ({ matches, teamStats } = data);

	$: stats = mapTeamStats(matches ?? [], teamStats ?? []);

	const speechBubbleText: string[] = [
		'Her er oversikten over kampene som er blitt spilt i løpet av årets sesong.',
		'Ved å trykke på en kamp får du oversikten over hvem som scoret og assisterte.',
		'I tillegg vises også individuelle c-momenter, noe vi alle vet er en viktig statistikk.'
	];
</script>

<div class="structure">
	<h1>Kamper</h1>

	<RuleSpeechBubble imageSrc={madsSeriosSrc} text={speechBubbleText} mirror={true} />

	{#if stats.length > 0}
		{#each stats as match}
			<div class="py-4">
				<MatchCard {match} />
			</div>
		{/each}
	{:else}
		<div class="p-8 tablet:p-4 laptop:p-0">
			<h5>Det er ikke blitt spilt noen kamper foreløpig.</h5>
		</div>
	{/if}
</div>
