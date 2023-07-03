<script lang="ts">
	import { goto } from '$app/navigation';
    import type { Season, Team } from '$lib/types/newTypes';

    // Get specifics, can be used in script
    export let season: Season | null;
    export let teams: Team[];

    let userTeams = [
        {
            username: "StratosKosepose",
            points: 80
        },
        {
            username: "HDMatrix",
            points: 75
        },
        {
            username: "Xirxem",
            points: 69
        },
        {
            username: "BezoumnyJeezny",
            points: 60
        },
        {
            username: "F0restDude13",
            points: 58
        }
    ]
</script>


<div class="structure">
    <div class="w-full h-[44vw] laptop:h-128">
        <video width="100%" autoplay muted loop>
            <source src="jogabonito.mp4" type="video/mp4">
        </video>
    </div>
    {#if season}
        <div class="w-3/4 tablet:2/3 flex flex-col items-center space-y-12">
            <h2> { season.name } </h2>
            <table class="table-auto w-full bg-secondary-color-light text-primary-color-dark rounded-lg">
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
                        <th>{team.name}</th>
                        <th>{(team.wins+team.draws+team.losses)}</th>
                        <th>{team.wins}</th>
                        <th>{team.draws}</th>
                        <th>{team.losses}</th>
                    </tr>
                    {/each}
                </tbody>
            </table>
            <div class="w-full flex flex-row space-x-4">
                <div class="w-80 flex flex-col items-center grow group hover:cursor-pointer" on:mouseup={() => goto("/players")}>
                    <img src="/players.png" alt="players" class="w-3/4 mb-2 group-hover:scale-105 group-active:scale-100" />
                    <button class="btn w-1/2 group-hover:scale-105 group-active:scale-100">Spillere</button>
                </div>
                <div class="w-80 flex flex-col items-center grow group hover:cursor-pointer" on:mouseup={() => goto("/teams")}>
                    <img src="/teams.png" alt="players" class="w-3/4 mb-2 group-hover:scale-105 group-active:scale-100" />
                    <button class="btn w-1/2 group-hover:scale-105 group-active:scale-100">Lag</button>
                </div>
            </div>
        </div>
    {:else}
        <h2> No active season </h2>
    {/if}
</div>

<div class="w-full bg-primary-color flex flex-col items-center justify-center">
    <h2> Fantasy Standings </h2>
    <div class="container max-w-screen-laptop">
        <table class="table-fixed w-full">
            <thead>
                <tr>
                    <th>Posisjon</th>
                    <th>Bruker</th>
                    <th>Poeng</th>
                </tr>
            </thead>
            <tbody>
                {#each userTeams as team, i}
                <tr>
                    <th>{(i+1)+"."}</th>
                    <th>{team.username}</th>
                    <th>{team.points}</th>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    video { 
        position: relative;
        transform-origin: 0 0;
        transform: scaleY(0.6);
    }
</style>