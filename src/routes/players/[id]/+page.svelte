<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';
	import IconStats from '$lib/components/common/IconStats.svelte';
	import { fillSeasonMapWithStatsForPlayer, mapTeamStats } from '$lib/shared/MatchStatsFunctions';

	// Get server data
	export let data: PageData;
	$: ({ playerVersions, allMatches, teamStats, season } = data);
	$: player = playerVersions?.find((version) => version.season_id == season?.id);
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);
	$: seasonStatsArr = fillSeasonMapWithStatsForPlayer(matches, playerVersions ?? []);

	let showStats: boolean = false;
</script>

{#if player}
	<div class="structure">
		<Player {player} />

		<button class="btn" on:click={() => (showStats = !showStats)}> Vis statistikk </button>

		{#if showStats}
			{#each seasonStatsArr as seasonStats}
				<div class="w-full flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6 pb-12 border-b-4 border-secondary-light">
					<h3>{seasonStats.season_name}</h3>
					<div class="grid grid-cols-3 w-full tablet:w-2/3 pb-2 border-b-2">
						<IconStats amount={seasonStats.goals} large={true} icon={'goal'} />
						<IconStats amount={seasonStats.assists} large={true} icon={'assist'} />
						<IconStats amount={seasonStats.clutches} large={true} icon={'clutch'} />
					</div>
					<div class="grid grid-cols-2 w-full tablet:w-2/3">
						<IconStats amount={seasonStats.wins} large={true} icon={'win'} />
						<IconStats amount={seasonStats.clean_sheets} large={true} icon={'cleansheet'} />
					</div>
				</div>
			{:else}
				<p>Ingen statistikk å vise</p>
			{/each}
		{/if}
	</div>
{:else}
	<p>Fant ente spellern med id {$page.params.slug}</p>
{/if}
