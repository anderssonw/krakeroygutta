<script lang="ts">
    import { supabase } from "$lib/supabase";
    import type { Season, Player, CreateGoal, Stats } from "$lib/types/newTypes";

    export let activeSeason: Season;
    export let allPlayers: Player[];
    export let allStats: Stats[];

    let showPoints: boolean = false;

    let loading = false;
    const handleGoal = async (pid: number) => {
        loading = true;

        // Get current stats
        let playerStats: Stats[] = allStats.filter((stats: Stats) => stats.pid == pid && stats.sid == activeSeason.sid);
        let curGoals = playerStats[0].goals;

        try {
            // Create new season
            let newGoal: CreateGoal = {
                pid: pid,
                sid: activeSeason.sid,
                goals: curGoals+1
            }
            
            const { error } = await supabase.from('playersstats').upsert(newGoal, {onConflict: 'pid, sid'});

            if (error) {
                alert(error.message);
            } else {
                alert("Added goal to player!");
                location.reload();
            }
        } finally {
            loading = false;
        }
	};
</script>

<div class="flex flex-row items-center space-x-4">
    <h2> Administrer poenggivning </h2>
    <div class="hover:cursor-pointer" on:mouseup={() => showPoints = !showPoints }>
        {#if showPoints}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
        {/if}
    </div>
</div>
{#if showPoints}
    <div class="w-full bg-primary-color text-center">
        <h3> Gi poeng til spillere </h3>
        <div class="flex flex-col space-y-2">
        {#each allPlayers as player}
            <div class="flex flex-row space-x-2">
                <p class="w-4/12"> {player.name} </p>
                <button class="btn w-2/12" on:click={() => handleGoal(player.pid)}> Goal </button>
                <button class="btn w-2/12"> Assist </button>
                <button class="btn w-2/12"> Win </button>
                <button class="btn w-2/12"> Clean sheet </button>
            </div>
        {/each}
        </div>
    </div>
{/if}