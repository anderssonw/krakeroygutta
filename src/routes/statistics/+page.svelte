<script lang="ts">
	import type { PageData } from './$types';
	import PlayerStatisticsTable from '$lib/components/statistics/PlayerStatisticsTable.svelte';
	import type { DropdownOption, FilterOption, PlayerStatsSeasonSummary } from '$lib/types/newTypes';
	import FilterMenu from '$lib/components/admin/FilterMenu.svelte';
	import { onMount } from 'svelte';
	import { calculateFantasyPoints, mapMatchSummary, mapPlayerStatistics, mapTeamStats } from '$lib/shared/newMatchStatFunctions';
	import PlayerFantasyRanks from '$lib/components/statistics/PlayerFantasyRanks.svelte';

	export let data: PageData;
	// All of this stuff is also in admin/layout, not sure how to copy it over effectively just letting it stay for now

	$: ({ seasons, players, allMatches, teamStats, season, fantasyTeamPlayers } = data);
	$: matches = mapTeamStats(allMatches, teamStats);
    $: matchSummary = mapMatchSummary(matches);

    const filterOptions: FilterOption[] = [
        {
            id: 1,
            name: 'Navn',
            desc: true,
        },
        {
            id: 2,
            name: 'Mål',
            desc: true,
        },
        {
            id: 3,
            name: 'Assist',
            desc: true,
        },
        {
            id: 4,
            name: 'C-moment',
            desc: true,
        },
        {
            id: 5,
            name: 'Seiere',
            desc: true,
        },
        {
            id: 6,
            name: 'Clean sheets',
            desc: true,
        },
        {
            id: 7,
            name: 'Poeng',
            desc: true,
        },
    ]
    $: filterOption = filterOptions[filterOptions.length-1];

    const seasonDefaultOptions: FilterOption[] = [
        {
                name: 'Oppsummering',
                id: -2,
                desc: true
            },
            {
                name: 'Sesong for sesong',
                id: -1,
                desc: true
            },
    ]
    $: seasonOption = seasonDefaultOptions[0];
    const getCurrentSeason = () => {
        if (season) {
            return { name: season.name, id: season.id, desc: true } satisfies FilterOption
        }

        return seasonDefaultOptions[0];
    }
    const getSeasonOptions = () => {
		if (!seasons) return [];

		let statsSeasons: FilterOption[] = seasonDefaultOptions;
		seasons.sort((a, b) => b.id - a.id).forEach((season) => {
			if (new Date(season.deadline_time) < new Date()) {
				let opt = {
					name: season.name,
					id: season.id,
                    desc: true
				} satisfies FilterOption;
				statsSeasons.push(opt);
			}
		});

		return statsSeasons;
	};

    export const splitName = (player_name: string) => {
        return player_name.split(' ')[player_name.split(' ').length - 1];
    }

    const sortByFilter = (players: PlayerStatsSeasonSummary[], filterOption: FilterOption | null) => {
        if (!filterOption) return players;

        let copyPlayerStatsSummary = [...players];

        if (filterOption.id === filterOptions[0].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => splitName(a.player_name).localeCompare(splitName(b.player_name)))
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => splitName(b.player_name).localeCompare(splitName(a.player_name)))
            }
            return copyPlayerStatsSummary;
        }

        if (filterOption.id === filterOptions[1].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.goals-a.goals)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.goals-b.goals)
            }
            return copyPlayerStatsSummary;
        }

        if (filterOption.id === filterOptions[2].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.assists-a.assists)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.assists-b.assists)
            }
            return copyPlayerStatsSummary;
        }

        if (filterOption.id === filterOptions[3].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.clutches-a.clutches)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.clutches-b.clutches)
            }
            return copyPlayerStatsSummary;
        }

        if (filterOption.id === filterOptions[4].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.wins-a.wins)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.wins-b.wins)
            }
            return copyPlayerStatsSummary;
        }

        if (filterOption.id === filterOptions[5].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.clean_sheets-a.clean_sheets)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.clean_sheets-b.clean_sheets)
            }
            return copyPlayerStatsSummary;
        }

        
        if (filterOption.id === filterOptions[6].id) {
            if (filterOption.desc) {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => b.points-a.points)
            } else {
                copyPlayerStatsSummary = copyPlayerStatsSummary.sort((a, b) => a.points-b.points)
            }
            return copyPlayerStatsSummary;
        }

        return players;
    }

    const mapPlayersByPoints = (seasonOption: DropdownOption) => {
        const playerStatsSummaryArray: PlayerStatsSeasonSummary[] = [];
        players.forEach((player) => {
            const playerStatistics = mapPlayerStatistics(matchSummary, player.id.toString());

            if (seasonOption.id === seasonDefaultOptions[0].id) {
                const playerStatsSummary: PlayerStatsSeasonSummary = {
                        season_id: 0,
                        player_id: player.id,
                        player_image: player.image,
                        player_name: player.name,
                        goals: 0,
                        assists: 0,
                        clutches: 0,
                        points: 0,
                        wins: 0,
                        clean_sheets: 0
                    }

                playerStatistics.forEach((playerSeason) => {
                    const getCurrentSeason = seasons.find(s => s.id === playerSeason.season_id);

                    if (getCurrentSeason) {
                        const fantasyPoints = calculateFantasyPoints(playerStatistics, getCurrentSeason, false);

                        playerStatsSummary.goals += playerSeason.goals;
                        playerStatsSummary.assists += playerSeason.assists;
                        playerStatsSummary.clutches += playerSeason.clutches;
                        playerStatsSummary.wins += playerSeason.wins;
                        playerStatsSummary.clean_sheets += playerSeason.clean_sheets;
                        playerStatsSummary.points += fantasyPoints;
                    }
                })

                playerStatsSummaryArray.push(playerStatsSummary);
            } else if (seasonOption.id === seasonDefaultOptions[1].id) {
                playerStatistics.forEach((playerSeason) => {
                    const getCurrentSeason = seasons.find(s => s.id === playerSeason.season_id);

                    if (getCurrentSeason) {
                        const fantasyPoints = calculateFantasyPoints(playerStatistics, getCurrentSeason, false);

                        const playerStatsSummary: PlayerStatsSeasonSummary = {
                            season_id: getCurrentSeason.id,
                            player_id: player.id,
                            player_image: player.image,
                            player_name: player.name,
                            goals: playerSeason.goals,
                            assists: playerSeason.assists,
                            clutches: playerSeason.clutches,
                            points: fantasyPoints,
                            wins: playerSeason.wins,
                            clean_sheets: playerSeason.clean_sheets
                        }
                        playerStatsSummaryArray.push(playerStatsSummary);
                    }
                })
            } else {
                const playerStats = playerStatistics.find(ps => ps.season_id === seasonOption.id);
                const getCurrentSeason = seasons.find(s => s.id === seasonOption.id);

                if (playerStats && getCurrentSeason) {
                    const fantasyPoints = calculateFantasyPoints([playerStats], getCurrentSeason, false);
                    const playerStatsSummary: PlayerStatsSeasonSummary = {
                        season_id: getCurrentSeason.id,
                        player_id: player.id,
                        player_image: player.image,
                        player_name: player.name,
                        goals: playerStats.goals,
                        assists: playerStats.assists,
                        clutches: playerStats.clutches,
                        points: fantasyPoints,
                        wins: playerStats.wins,
                        clean_sheets: playerStats.clean_sheets
                    }
                    playerStatsSummaryArray.push(playerStatsSummary);
                }
            }
        })

        return playerStatsSummaryArray.sort((a, b) => b.points - a.points);
    }

    $: allPlayerStatistics = mapPlayersByPoints(seasonOption);

    onMount(() => {
        seasonOption = getCurrentSeason();
    })
</script>

<div class="structure">

    <div class="w-full flex justify-between">
        <FilterMenu header="Sesong" options={getSeasonOptions()} bind:selectedOption={seasonOption} optionPlacement='right' sorting={false} />
        <FilterMenu header="Sortér" options={filterOptions} bind:selectedOption={filterOption} optionPlacement='left' sorting={true} />
    </div>

    {#if seasonOption.id === seasonDefaultOptions[0].id}
        <div class="w-full">
            <div class="flex justify-center mb-8 px-2">
                <h1 class="text-center text-3xl tablet:text-4xl">{seasonOption.name}</h1>
            </div>
            <div class="grid gap-4">
                {#each sortByFilter(allPlayerStatistics, filterOption) as player}
                    <PlayerStatisticsTable player={player} />
                {/each}
            </div>
        </div>
    {:else if seasonOption.id === seasonDefaultOptions[1].id}
        <div class="w-full flex flex-col gap-16">
            {#each seasons.sort((a, b) => b.id - a.id) as seas}
                <div>
                    <div class="flex justify-center mb-8 px-2">
                        <h1 class="text-center text-3xl tablet:text-4xl">{seas.name}</h1>
                    </div>
                    <div class="grid gap-4">
                        {#each sortByFilter(allPlayerStatistics.filter(aps => aps.season_id === seas.id), filterOption) as player}
                            <PlayerStatisticsTable player={player} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="w-full flex flex-col gap-8">
            <div class="flex justify-center px-2">
                <h1 class="text-center text-3xl tablet:text-4xl">{seasonOption.name}</h1>
            </div>
            <div class="grid gap-4">
                {#each sortByFilter(allPlayerStatistics, filterOption) as player}
                    <PlayerStatisticsTable player={player} />
                {/each}
            </div>

            <PlayerFantasyRanks fantasyTeamPlayers={fantasyTeamPlayers.filter(ftp => ftp.season_id === seasonOption.id)} allPlayerStatistics={allPlayerStatistics} />
        </div>
    {/if}
</div>
