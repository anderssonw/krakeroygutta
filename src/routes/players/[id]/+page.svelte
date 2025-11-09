<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
	import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
	import fieldIcon from '$lib/assets/stat_icons/field_icon.png';
	import winIcon from '$lib/assets/stat_icons/win_icon.png';
	import cleanIcon from '$lib/assets/stat_icons/cleansheet_icon.png';
	import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';
	import { onMount } from 'svelte';
	import type { FullPlayer } from '$lib/types/newTypes';
	import { mapMatchSummary, mapPlayerStatistics, mapTeamStats } from '$lib/shared/newMatchStatFunctions';

	// Get server data
	export let data: PageData;

	$: ({ playerVersions, allMatches, teamStats, season } = data);

	$: matches = mapTeamStats(allMatches ?? [], teamStats ?? []);
	$: matchSummary = mapMatchSummary(matches);
	$: playerStatistics = mapPlayerStatistics(matchSummary, data.player_id ?? '0');

	let prevPlayer: FullPlayer | null = null;
	onMount(() => {
		const curPlayerIndex = playerVersions?.findIndex((version) => version.season_id == season?.id);
		if (curPlayerIndex && playerVersions) {
			prevPlayer = playerVersions[curPlayerIndex - 1];
		}
	});
</script>

{#if playerVersions && season}
	<div class="structure">
		<Player {playerVersions} {season} />

		<div class="w-full bg-primary-color laptop:rounded-lg p-4 tablet:p-8 flex flex-col gap-8">
			<div class="flex flex-row justify-between px-0 mobile:px-4 tablet:px-16">
				<div class="flex flex-col items-center gap-2">
					<div><img class={'w-16 mobile:w-20'} src={fieldIcon} alt="kamper" /></div>
					<div class="text-5xl">{playerStatistics.reduce((init, current) => init + current.games, 0)}</div>
					<div class="text-base">kamper</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div><img class={'w-16 mobile:w-20'} src={winIcon} alt="seiere" /></div>
					<div class="text-5xl">{playerStatistics.reduce((init, current) => init + current.wins, 0)}</div>
					<div class="text-base">seiere</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div><img class={'w-16 mobile:w-20'} src={goalIcon} alt="goal" /></div>
					<div class="text-5xl">{playerStatistics.reduce((init, current) => init + current.goals, 0)}</div>
					<div class="text-base">mål</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<div><img class={'w-16 mobile:w-20'} src={assistIcon} alt="assist" /></div>
					<div class="text-5xl">{playerStatistics.reduce((init, current) => init + current.assists, 0)}</div>
					<div class="text-base">assist</div>
				</div>
			</div>

			<div class="w-full rounded text-primary-color-dark border border-tertiary-color-dark">
				<div class="bg-tertiary-color-light rounded-t grid grid-cols-8 border-t border-x border-primary-color-light">
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4 col-span-2">Sesong</div>
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={fieldIcon} alt="kamper" />
					</div>
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={winIcon} alt="seiere" />
					</div>
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={cleanIcon} alt="clean" />
					</div>
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={goalIcon} alt="mål" />
					</div>
					<div class="border-b border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={assistIcon} alt="assist" />
					</div>
					<div class="border-b border-primary-color-light p-1 mobile:p-2 tablet:p-4">
						<img class={'w-8'} src={clutchIcon} alt="c-moment" />
					</div>
				</div>
				{#each playerStatistics as seasonStats, idx}
					<div
						class="bg-secondary-color grid grid-cols-8 border-x border-primary-color-light odd:bg-secondary-color-dark last:border-b last:rounded-b"
					>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4 col-span-2"
						>
							{seasonStats.season_name}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.games}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.wins}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.clean_sheets}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.goals}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-r border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.assists}
						</div>
						<div
							class="{idx !== playerStatistics.length - 1
								? 'border-b'
								: ''} border-primary-color-light flex items-center p-1 mobile:p-2 tablet:p-4"
						>
							{seasonStats.clutches}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<p>Fant ente spellern med id {$page.params.slug}</p>
{/if}
