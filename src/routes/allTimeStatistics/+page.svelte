<script lang="ts">
	import type { PageData } from './$types';
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
	import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
	import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';
	import winIcon from '$lib/assets/stat_icons/win_icon.png';
	import cleanIcon from '$lib/assets/stat_icons/cleansheet_icon.png';
	import { getTotalStatsForPlayer, mapTeamStats } from '$lib/shared/MatchStatsFunctions';
	import PlayerStatisticsTable from '$lib/components/statistics/PlayerStatisticsTable.svelte';
	import type { DropdownOption, PlayerStatsSeasonSummary } from '$lib/types/newTypes';
	import FilterMenu from '$lib/components/admin/FilterMenu.svelte';
	import { afterUpdate, onMount } from 'svelte';

	export let data: PageData;
	// All of this stuff is also in admin/layout, not sure how to copy it over effectively just letting it stay for now

	$: ({ seasons, players, allMatches, teamStats, season } = data);
	$: matches = mapTeamStats(allMatches, teamStats);

    const filterOptions: DropdownOption[] = [
        {
            id: 1,
            name: 'Navn'
        },
        {
            id: 2,
            name: 'Mål'
        },
        {
            id: 3,
            name: 'Assist'
        },
        {
            id: 4,
            name: 'C-moment'
        },
        {
            id: 5,
            name: 'Seiere'
        },
        {
            id: 6,
            name: 'Clean sheets'
        },
        {
            id: 7,
            name: 'Poeng'
        },
    ]
    $: filterOption = null;

    const seasonDefaultOptions: DropdownOption[] = [
        {
                name: 'Oppsummering',
                id: -2
            },
            {
                name: 'Sesong for sesong',
                id: -1
            },
    ]
    $: seasonOption = seasonDefaultOptions[0];
    const getCurrentSeason = () => {
        if (season) {
            return { name: season.name, id: season.id }
        }

        return seasonDefaultOptions[0];
    }
    const getSeasonOptions = () => {
		if (!seasons) return [];

		let statsSeasons: DropdownOption[] = seasonDefaultOptions;
		seasons.sort((a, b) => b.id - a.id).forEach((season) => {
			if (new Date(season.deadline_time) < new Date()) {
				let opt = {
					name: season.name,
					id: season.id
				} satisfies DropdownOption;
				statsSeasons.push(opt);
			}
		});

		return statsSeasons;
	};

    const sortByFilter = (players: PlayerStatsSeasonSummary[]) => {
        let copyPlayerStatsSummary = [...players];

        if (filterOption === filterOptions[1]) {
            copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.goals-b.goals)
            return copyPlayerStatsSummary;
        }

        console.log(copyPlayerStatsSummary);


        return players;
    }

    onMount(() => {
        seasonOption = getCurrentSeason();
    })
</script>

<div class="structure">

    <div class="w-full flex justify-between">
        <FilterMenu header="Sesong" options={getSeasonOptions()} bind:selectedOption={seasonOption} optionPlacement='right' />
        <FilterMenu header="Sortér" options={filterOptions} bind:selectedOption={filterOption} optionPlacement='left' />
    </div>

    {#if seasonOption.id === seasonDefaultOptions[0].id}
        <div class="w-full">
            <div class="flex justify-center mb-8">
                <h1 class="text-center text-4xl">{seasonOption.name}</h1>
            </div>
            <div class="grid gap-4">
                {#each getTotalStatsForPlayer(players, matches, season) as player}
                    <PlayerStatisticsTable player={player} />
                {/each}
            </div>
        </div>
    {:else if seasonOption.id === seasonDefaultOptions[1].id}
        <div class="w-full flex flex-col gap-16">
            {#each seasons.sort((a, b) => b.id - a.id) as season}
                <div>
                    <div class="flex justify-center mb-8">
                        <h1 class="text-center text-4xl">{season.name}</h1>
                    </div>
                    <div class="grid gap-4">
                        {#each getTotalStatsForPlayer(players, matches.filter(match => match.season_id === season.id), season) as player}
                            <PlayerStatisticsTable player={player} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="w-full">
            <div class="flex justify-center mb-8">
                <h1 class="text-center text-4xl">{seasonOption.name}</h1>
            </div>
            <div class="grid gap-4">
                {#each sortByFilter(getTotalStatsForPlayer(players, matches.filter(match => match.season_id === seasonOption.id), season)) as player}
                    <PlayerStatisticsTable player={player} />
                {/each}
            </div>
        </div>
    {/if}
</div>
