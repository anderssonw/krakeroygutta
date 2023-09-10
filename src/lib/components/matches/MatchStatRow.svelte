<script lang="ts">
	import type { MatchDisplay, PlayerStats } from "$lib/types/newTypes";

    export let match: MatchDisplay;
    export let stat_type: string;

    function getStatType(stat_type: string, player_stats: PlayerStats) {
        if (stat_type == 'goal') return player_stats.goals;
        else if (stat_type == 'assist') return player_stats.assists;
        else return player_stats.clutches;
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
            <img src="/stat_icons/{stat_type}_icon.png" alt="{stat_type}"/>
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