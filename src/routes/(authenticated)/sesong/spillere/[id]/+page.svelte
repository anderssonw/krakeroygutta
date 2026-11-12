<script lang="ts">
	import type { PageProps } from './$types';
	import DetailedPlayer from '$lib/components/PlayerPage/DetailedPlayer.svelte';
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
	import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
	import fieldIcon from '$lib/assets/stat_icons/field_icon.png';
	import winIcon from '$lib/assets/stat_icons/win_icon.png';
	import cleanIcon from '$lib/assets/stat_icons/cleansheet_icon.png';
	import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';

	let { data }: PageProps = $props();

	const player = $derived(data.playerVersions.find((version) => version.season_id === data.season.id));
	const totals = $derived.by(() =>
		data.seasonStats.reduce(
			(total, stats) => ({
				matches: total.matches + stats.matches,
				wins: total.wins + stats.wins,
				goals: total.goals + stats.goals,
				assists: total.assists + stats.assists
			}),
			{ matches: 0, wins: 0, goals: 0, assists: 0 }
		)
	);
</script>

<div class="container mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-8">
	{#if player}
		<div class="flex w-full flex-col items-center gap-3">
			<DetailedPlayer {player} previousPlayer={data.previousPlayer} />
		</div>
	{:else}
		<p class="text-center">Spillerkortet er ikke tilgjengelig for inneværende sesong.</p>
	{/if}

	<!--
	<div class="bg-primary-color laptop:rounded-lg flex w-full flex-col gap-8 rounded-lg p-4 tablet:p-8">
		<div class="mobile:px-4 tablet:px-16 flex flex-row justify-between gap-2">
			<div class="flex flex-col items-center gap-2">
				<img class="mobile:w-20 w-16" src={fieldIcon} alt="Kamper" />
				<div class="text-3xl tablet:text-5xl">{totals.matches}</div>
				<div class="text-base">kamper</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img class="mobile:w-20 w-16" src={winIcon} alt="Seiere" />
				<div class="text-3xl tablet:text-5xl">{totals.wins}</div>
				<div class="text-base">seiere</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img class="mobile:w-20 w-16" src={goalIcon} alt="Mål" />
				<div class="text-3xl tablet:text-5xl">{totals.goals}</div>
				<div class="text-base">mål</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img class="mobile:w-20 w-16" src={assistIcon} alt="Assist" />
				<div class="text-3xl tablet:text-5xl">{totals.assists}</div>
				<div class="text-base">assist</div>
			</div>
		</div>

		<div class="text-primary-color-dark border-tertiary-color-dark w-full overflow-x-auto rounded border">
			<div class="bg-tertiary-color-light border-primary-color-light grid min-w-[36rem] grid-cols-8 rounded-t border-x border-t">
				<div class="border-primary-color-light col-span-2 flex items-center border-r border-b p-2 tablet:p-4">Sesong</div>
				<div class="border-primary-color-light flex items-center border-r border-b p-2 tablet:p-4">
					<img class="w-8" src={fieldIcon} alt="Kamper" />
				</div>
				<div class="border-primary-color-light flex items-center border-r border-b p-2 tablet:p-4">
					<img class="w-8" src={winIcon} alt="Seiere" />
				</div>
				<div class="border-primary-color-light flex items-center border-r border-b p-2 tablet:p-4">
					<img class="w-8" src={cleanIcon} alt="Hold uten baklengsmål" />
				</div>
				<div class="border-primary-color-light flex items-center border-r border-b p-2 tablet:p-4">
					<img class="w-8" src={goalIcon} alt="Mål" />
				</div>
				<div class="border-primary-color-light flex items-center border-r border-b p-2 tablet:p-4">
					<img class="w-8" src={assistIcon} alt="Assist" />
				</div>
				<div class="border-primary-color-light border-b p-2 tablet:p-4">
					<img class="w-8" src={clutchIcon} alt="Clutch" />
				</div>
			</div>
			{#each data.seasonStats as stats (stats.season_id)}
				<div class="bg-secondary-color border-primary-color-light odd:bg-secondary-color-dark grid min-w-[36rem] grid-cols-8 border-x last:rounded-b last:border-b">
					<div class="border-primary-color-light col-span-2 flex items-center border-r p-2 tablet:p-4">
						{stats.season_name}
					</div>
					<div class="border-primary-color-light flex items-center border-r p-2 tablet:p-4">{stats.matches}</div>
					<div class="border-primary-color-light flex items-center border-r p-2 tablet:p-4">{stats.wins}</div>
					<div class="border-primary-color-light flex items-center border-r p-2 tablet:p-4">{stats.clean_sheets}</div>
					<div class="border-primary-color-light flex items-center border-r p-2 tablet:p-4">{stats.goals}</div>
					<div class="border-primary-color-light flex items-center border-r p-2 tablet:p-4">{stats.assists}</div>
					<div class="border-primary-color-light flex items-center p-2 tablet:p-4">{stats.clutches}</div>
				</div>
			{/each}
		</div>
	</div>
   -->
</div>
