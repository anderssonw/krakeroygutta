<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { PageData } from './$types';
	import pirateMadsSrc from '$lib/assets/piratmads.png';

	// Get server data
	export let data: PageData;
	$: ({ teams, season } = data);

	const speechBubbleText: string[] = [
		'Her finner du lagene til årets futsal turnering.',
		'Alle lag skal møte opp i klær som tilsvarer lagets farge.',
		'Om du ikke har fargen tilgjengelig hjemme, så må du høre med andre om du kan låne.'
	];
</script>

{#if teams}
	<div class="structure">
		<h1>Teams</h1>
		<RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} mirror={true} />

		{#each teams as team}
			<div class="w-full py-8 border-4 rounded-lg">
				<h3 class="text-center">Team - {team.color}</h3>

				<div class="grid grid-cols-2 tablet:grid-cols-4 gap-y-8">
					{#each team.players as player}
						<div class="flex justify-center">
							<Card player={player} card_size={CARD_SIZE.MEDIUM} season={season}/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}
