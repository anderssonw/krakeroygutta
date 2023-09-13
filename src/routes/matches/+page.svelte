<script lang="ts">
	import TeamKit from '$lib/components/common/TeamKit.svelte';
    import MatchStatRow from '$lib/components/matches/MatchStatRow.svelte';
	import type { MatchStatsPlayer, MatchStatsTeam } from '$lib/types/newTypes';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ matchesStats } = data);
    $: stats = matchesStats ?? []; // Avoid undefined
    
    function getGoalScore(team: MatchStatsTeam): number {
        return team.players.reduce((a: number, b: MatchStatsPlayer) => a + b.goals, 0);
    }
</script>

<button on:click={() => console.log(matchesStats)}>CLICK</button>
<!--
<div class="structure">
    <h1> Kamper </h1>

    {#each stats as match}

        <h3> Kamp {match.match_id} </h3>

        <div class="w-full flex flex-col space-y-4 laptop:space-y-8 border-y-2 laptop:border-4 bg-primary-color border-secondary-color-light laptop:rounded-lg p-4">
            
            <div class="flex flex-row justify-around items-center">
                <div class="w-20 tablet:w-24 laptop:w-32 tablet:h-24 laptop:h-32">
                    <div class="flex flex-col items-center">
                        <TeamKit color={match.home_team.color} />
                        <h3> {match.home_team.name} </h3>
                    </div>
                </div>
                <h1> vs </h1>
                <div class="w-20 tablet:w-24 laptop:w-32 tablet:h-24 laptop:h-32">
                    <div class="flex flex-col items-center">
                        <TeamKit color={match.away_team.color} />
                        <h3> {match.away_team.name} </h3>
                    </div>
                </div>
            </div>
    
            <div class="flex flex-row justify-center items-center space-x-12">
                <h1> {getGoalScore(match.home_team)} </h1>
                <h1> - </h1>
                <h1> {getGoalScore(match.away_team)} </h1>
            </div>

            <MatchStatRow match={match} stat_type="goal" />
            <MatchStatRow match={match} stat_type="assist" />
            <MatchStatRow match={match} stat_type="clutch" />
        </div>
    {/each}

</div>
-->