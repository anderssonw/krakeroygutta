<script lang="ts">
	import { goto } from '$app/navigation';
    import type { FantasyStanding, Season, Team, Player } from '$lib/types/newTypes';

    // Get specifics, can be used in script
    export let activeSeason: Season;
    export let teams: Team[];
    export let fantasyTeams: FantasyStanding[];
    export let players: Player[];

    console.log(fantasyTeams);
    console.log(players);

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
    {#if activeSeason.sid}
        <div class="w-3/4 tablet:2/3 flex flex-col items-center space-y-12 pb-12">
            <h2> { activeSeason.name } </h2>
            <table class="table-auto w-full bg-secondary-color-light text-primary-color-dark rounded-xl">
                <thead>
                    <tr class="border-b-4 border-secondary-color-dark">
                        <th class="border-r-4 border-secondary-color-dark">Pos</th>
                        <th class="border-r-4 border-secondary-color-dark">Team</th>
                        <th>GP</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                    </tr>
                </thead>
                <tbody>
                    {#each teams as team, i}
                    <tr class="border-t-2 border-secondary-color">
                        <th class="border-r-2 border-secondary-color">{(i+1)+"."}</th>
                        <th class="border-r-2 border-secondary-color flex-row items-center justify-center">
                            {team.name}
                            <div class="inline-block w-3 h-3 bg-green-500"></div>
                        </th>
                        <th>{(team.wins+team.draws+team.losses)}</th>
                        <th>{team.wins}</th>
                        <th>{team.draws}</th>
                        <th>{team.losses}</th>
                    </tr>
                    {/each}
                </tbody>
            </table>
            <div class="w-full flex flex-row flex-wrap tablet:flex-nowrap space-x-4">
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

       
        <div class="relative w-full bg-primary-color flex flex-col items-center space-y-12 justify-center pb-60 rounded-t-[25%]">
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
      
    {:else}
        <h2> No active season </h2>
    {/if}
</div>

<style>
    video { 
        position: relative;
        transform-origin: 0 0;
        transform: scaleY(0.6);
    }
</style>