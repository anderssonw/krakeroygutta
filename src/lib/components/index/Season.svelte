<script lang="ts">
	import type { Season, Team } from '$lib/types/newTypes';

    // Get specifics, can be used in script
    export let season: Season | null;
    export let teams: Team[];
</script>

<div class="structure">
    {#if season}
        <div class="w-3/4 tablet:2/3 flex flex-col items-center space-y-4">
            <h2> { season.Name } </h2>
            <table class="table-auto w-full bg-primary-color">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>GP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                    </tr>
                </thead>
                <tbody>
                    {#each teams as team, i}
                    <tr>
                        <th>{(i+1)+"."}</th>
                        <th>{team.Name}</th>
                        <th>{team.Games}</th>
                        <th>{team.Win}</th>
                        <th>{team.Draw}</th>
                        <th>{team.Loss}</th>
                    </tr>
                    {/each}
                </tbody>
            </table>
            <div class="w-full bg-primary-color-light flex flex-row space-x-4">
                <div class="h-40 bg-primary-color grow flex items-center justify-center">
                    <h4> Players </h4> 
                </div>
                <div class="h-40 bg-primary-color grow flex items-center justify-center">
                    <h4> Teams </h4> 
                </div>
            </div>
        </div>
    {:else}
        <h2> No active season </h2>
    {/if}


    <div class="w-3/4 tablet:2/3 flex flex-col items-center space-y-4">
        <h2> Tidligere sesonger </h2>
        <div class="w-full h-40 bg-primary-color-light flex items-center justify-center"> 
            <h4> Ex: Winter 2021 </h4> 
        </div>
    </div>
</div>
