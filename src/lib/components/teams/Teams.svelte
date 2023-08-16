<script lang="ts">
	import type { Team, Player } from "$lib/types/newTypes";
	import CardSmallInfo from "../fantasy/CardSmallInfo.svelte";

    /* TODO: */
    // -> Fix mobile view to not use absolute positioning

    export let teams: Team[]
    export let players: Player[];

    function getTeamPlayers(pids: number[]) : Player[] {
        return players.filter((player: Player) => pids.includes(player.pid));
    }

    console.log(teams);
    console.log(players);
</script>

<div class="structure">
    <h2>Teams</h2>

    {#each teams as team}
        <div class="w-full bg-primary-color-light">
            <h3 class="text-center"> Team - {team.color} </h3>


            <div class="flex flex-row">
                
                <div class="w-1/2">
                    <img src="/red_team.png" alt="red team" />
                </div>

                <div class="w-1/2 flex flex-wrap">
                    {#each getTeamPlayers(team.players) as player}
                    <div class="w-1/2 h-1/2">
                        <div class="small-card group aboslute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <CardSmallInfo player={player} />
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
    
</div>