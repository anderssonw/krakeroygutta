<script lang="ts">
    import type { Player } from "$lib/types/newTypes";
    export let player: Player;
    console.log(player);
</script>


<div class="structure">
    <img src="/{player.Picture}" alt="head"/>
    <h1>{player.Name}</h1>
</div>