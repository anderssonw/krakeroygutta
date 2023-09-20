<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';
	import IconStats from '$lib/components/common/IconStats.svelte';
	import { fillSeasonMapWithStatsForPlayer, getTeamStatsFromMatches, mapTeamStats } from '$lib/shared/MatchStatsFunctions';
	import type { FullPlayer, MatchStatsQuery, PlayerStats } from '$lib/types/newTypes';

	// Get server data
	export let data: PageData;
	$: ({ playerVersions, allMatches, teamStats, season } = data);
	$: player = playerVersions?.find(version => version.season_id == season?.id);
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);
	$: seasonStats = fillSeasonMapWithStatsForPlayer(matches, playerVersions ?? []);
</script>

<button on:click={() => {console.log(seasonStats);}}>CLICK</button>
{#if player}
	<div class="structure">
		<Player {player} />

		<div class="w-full flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6 pb-12 border-b-4 border-secondary-light">
			<h3>Summer 2023</h3>
			<div class="grid grid-cols-3 w-full tablet:w-2/3 pb-2 border-b-2">
				<IconStats amount={1} large={true} icon={'goal'} />
				<IconStats amount={5} large={true} icon={'assist'} />
				<IconStats amount={10} large={true} icon={'clutch'} />
			</div>
			<div class="grid grid-cols-2 w-full tablet:w-2/3">
				<IconStats amount={1} large={true} icon={'win'} />
				<IconStats amount={5} large={true} icon={'cleansheet'} />
			</div>
		</div>
		
		<div class="w-full flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6 pb-12 border-b-4 border-secondary-light">
			<h3>Summer 2023</h3>
			<div class="grid grid-cols-3 w-full tablet:w-2/3 pb-2 border-b-2">
				<IconStats amount={1} large={true} icon={'goal'} />
				<IconStats amount={5} large={true} icon={'assist'} />
				<IconStats amount={10} large={true} icon={'clutch'} />
			</div>
			<div class="grid grid-cols-2 w-full tablet:w-2/3">
				<IconStats amount={1} large={true} icon={'win'} />
				<IconStats amount={5} large={true} icon={'cleansheet'} />
			</div>
		</div>
	</div>
{:else}
	<p>Fant ente spellern med id {$page.params.slug}</p>
{/if}
