<script lang="ts">
	import Card from "./Card.svelte";
    import type { Player } from "$lib/types/newTypes";
    export let players: Player[];
</script>

<div class="structure">
    <h2> Spillere </h2>
    <div class="w-full flex flex-row flex-wrap gap-4 justify-center">
    {#each players as player}
        <Card player={player} />
    {/each}
    </div>
</div>
