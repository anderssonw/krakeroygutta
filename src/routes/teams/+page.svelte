<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { MatchWithTeams, PlayerMatchStats } from '$lib/types/newTypes';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ fullTeams, playerStats, season } = data);

	$: playersStats = calcPlayerStats();

	function calcPlayerStats() {
		
	}
</script>


{#if fullTeams}
	<div class="structure">
		<h2>Teams</h2>

		{#each fullTeams as team}
			<div class="w-full bg-primary-color-light">
				<h3 class="text-center">Team - {team.color}</h3>

				<div class="grid grid-cols-2 gap-y-8">
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