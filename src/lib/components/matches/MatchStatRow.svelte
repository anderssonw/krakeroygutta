<script lang="ts">
	import type { MatchStatsPlayer, MatchStatsQuery } from "$lib/types/newTypes";
    import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
    import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
    import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';

    export let match: MatchStatsQuery;
    export let stat_type: string;

    function getStatType(stat_type: string, player_stats: MatchStatsPlayer) {
        if (stat_type == 'goal') return player_stats.goals;
        else if (stat_type == 'assist') return player_stats.assists;
        else return player_stats.clutches;
    }
    function getImage(stat_type: string) {
        if (stat_type == 'goal') return goalIcon;
        if (stat_type == 'assist') return assistIcon;
        if (stat_type == 'clutch') return clutchIcon;
        return '';
    }
</script>

<div class="flex flex-row justify-center items-center border-b-2 laptop:border-b-4">
    <div class="w-5/12 p-2 text-center">
        {#each match.home_team.players as ht_player}
            {#if getStatType(stat_type, ht_player) > 0}
                <h5> {ht_player.name} x{getStatType(stat_type, ht_player)} </h5>
            {/if}
        {/each}
    </div>
    <div class="w-2/12 flex justify-center">
        <div class="w-24">
            <img src={getImage(stat_type)} alt="{stat_type}"/>
        </div>
    </div>
    <div class="w-5/12 p-2 text-center">
        {#each match.away_team.players as at_player}
            {#if getStatType(stat_type, at_player) > 0}
                <h5> {at_player.name} x{getStatType(stat_type, at_player)} </h5>
            {/if}
        {/each}
    </div>
</div>