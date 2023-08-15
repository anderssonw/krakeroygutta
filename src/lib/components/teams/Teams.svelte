<script lang="ts">
	import type { Team, Player } from "$lib/types/newTypes";
	import CardSmallInfo from "../fantasy/CardSmallInfo.svelte";

    export let teams: Team[]
    export let players: Player[];

    console.log(teams);
    console.log(players);
</script>

<div class="structure">
    <h2>Teams</h2>
    <div class="w-full bg-primary-color-light">
        <h3 class="text-center"> Red team </h3>
        <div class="flex flex-row">
            <img src="/red_team.png" alt="red team" />
            <div class="small-card group">
                <CardSmallInfo player={players[0]} />
            </div>
        </div>
    </div>
</div>