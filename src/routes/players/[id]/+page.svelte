<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';
	import IconStats from '$lib/components/common/IconStats.svelte';
	import { fillSeasonMapWithStatsForPlayer, mapTeamStats } from '$lib/shared/MatchStatsFunctions';
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
    import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
    import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';
    import winIcon from '$lib/assets/stat_icons/win_icon.png';
    import cleansheetIcon from '$lib/assets/stat_icons/cleansheet_icon.png';

	// Get server data
	export let data: PageData;
	$: ({ playerVersions, allMatches, teamStats, season } = data);
	$: player = playerVersions?.find((version) => version.season_id == season?.id);
	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);
	$: seasonStatsArr = fillSeasonMapWithStatsForPlayer(matches, playerVersions ?? []);
	console.log(seasonStatsArr);
</script>

{#if player}
	<div class="structure">
		<Player {player} />

		<div class="w-full bg-primary-color laptop:rounded-lg p-8 flex flex-col gap-8">
			<div class="flex flex-row justify-between px-16">
				<div class="flex flex-col items-center gap-2">
					<div class="h-20"></div>
					<div class="text-5xl">10</div>
					<div class="text-base">kamper</div>
				</div>
				<div class="flex flex-col items-center gap-2"> 		
					<div> <img class={'w-20'} src={winIcon} alt="seiere" /></div>
					<div class="text-5xl">10</div>
					<div class="text-base">seiere</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div> <img class={'w-20'} src={goalIcon} alt="goal" /></div>
					<div class="text-5xl">10</div>
					<div class="text-base">mål</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div> <img class={'w-20'} src={assistIcon} alt="assist" /></div>
					<div class="text-5xl">10</div>
					<div class="text-base">assist</div>
				</div>
			</div>

			<div class="w-full rounded text-primary-color-dark border border-tertiary-color-dark">
				<div class="bg-tertiary-color-light rounded-t grid grid-cols-8 border-t border-x border-primary-color-light">
					<div class="border-b border-r border-primary-color-light p-4 col-span-2">Sesong</div>
					<div class="border-b border-r border-primary-color-light p-4">Kamper</div>
					<div class="border-b border-r border-primary-color-light p-4">Seiere</div>
					<div class="border-b border-r border-primary-color-light p-4">Clean sheets</div>
					<div class="border-b border-r border-primary-color-light p-4">Mål</div>
					<div class="border-b border-r border-primary-color-light p-4">Assist</div>
					<div class="border-b border-primary-color-light p-4">C-moment</div>
				</div>
				{#each seasonStatsArr as seasonStats, idx}
					<div class="bg-secondary-color grid grid-cols-8 border-x border-primary-color-light odd:bg-secondary-color-dark last:border-b last:rounded-b">
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4 col-span-2">{seasonStats.season_name}</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4">10</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4">{seasonStats.wins}</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4">{seasonStats.clean_sheets}</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4">{seasonStats.goals}</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-r border-primary-color-light p-4">{seasonStats.assists}</div>
						<div class="{idx !== seasonStatsArr.length-1 ? 'border-b' : ''} border-primary-color-light p-4">{seasonStats.clutches}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<p>Fant ente spellern med id {$page.params.slug}</p>
{/if}
