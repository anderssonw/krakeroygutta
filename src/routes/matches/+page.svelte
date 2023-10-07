<script lang="ts">
	import TeamKit from '$lib/components/common/TeamKit.svelte';
    import MatchStatRow from '$lib/components/matches/MatchStatRow.svelte';
	import { mapTeamStats } from '$lib/shared/MatchStatsFunctions';
	import type { MatchStatsPlayer, MatchStatsTeam } from '$lib/types/newTypes';
	import type { PageData } from './$types';
    import ArrowDownIcon from 'virtual:icons/ph/arrow-fat-lines-down';
    import ArrowUpIcon from 'virtual:icons/ph/arrow-fat-lines-up';
    import madsSeriosSrc from '$lib/assets/speechbubble/madsBubble4.png';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';

	// Get server data
	export let data: PageData;
	$: ({ matches, teamStats } = data);

    $: stats = mapTeamStats(matches ?? [], teamStats ?? [])
    $: showMore = new Array(stats.length).fill(false);

    function getGoalScore(team: MatchStatsTeam): number {
        return team.players?.reduce((a: number, b: MatchStatsPlayer) => a + b.goals, 0);
    }

    const speechBubbleText: string[] = [
		'Her er oversikten over kampene som er blitt spilt i løpet av årets sesong.',
		'Ved å trykke på en kamp får du oversikten over hvem som scoret og assisterte.',
        'I tillegg vises også individuelle c-momenter, noe vi alle vet er en viktig statistikk.',
	];
</script>

<div class="structure">
    <h1> Kamper </h1>

    <RuleSpeechBubble imageSrc={madsSeriosSrc} text={speechBubbleText} mirror={true} />

    {#each stats as match, idx}
        <div class="w-full flex flex-col space-y-2 laptop:space-y-4 border-y-2 laptop:border-2 border-secondary-color-light laptop:rounded-lg 
            bg-primary-color hover:cursor-pointer p-2"
            on:mouseup={() => showMore[idx] = !showMore[idx]}>

            <h3 class="text-center"> Kamp {match.match_id} </h3>
            
            <div class="flex flex-row justify-around items-center">
                <div class="w-60 flex flex-col items-center">
                    <div class="w-24">
                        <TeamKit color={match.home_team.color} />
                    </div>
                    <h5> {match.home_team.name} </h5>
                </div>

                <div>
                    <div class="flex flex-row justify-center items-center space-x-6 tablet:space-x-12">
                        <h3> {getGoalScore(match.home_team)} </h3>
                        <h3> - </h3>
                        <h3> {getGoalScore(match.away_team)} </h3>
                    </div>
                </div>

                <div class="w-60 flex flex-col items-center">
                    <div class="w-24">
                        <TeamKit color={match.away_team.color} />
                    </div>
                    <h5> {match.away_team.name} </h5>
                </div>
            </div>

            {#if !showMore[idx]}
                <div class="flex justify-center -translate-y-2 tablet:-translate-y-4">
                    <div class="flex flex-col items-center">
                        <ArrowDownIcon class="text-[25px] tablet:text-[35px]" />
                    </div>
                </div>
            {:else}
                <MatchStatRow match={match} stat_type="goal" />
                <MatchStatRow match={match} stat_type="assist" />
                <MatchStatRow match={match} stat_type="clutch" />

                <div class="flex justify-center -translate-y-2 tablet:-translate-y-4">
                    <div class="flex flex-col items-center">
                        <ArrowUpIcon class="text-[25px] tablet:text-[35px]" />
                    </div>
                </div>
            {/if}
        </div>

    {/each}

</div>