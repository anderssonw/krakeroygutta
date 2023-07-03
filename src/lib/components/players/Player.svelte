<script lang="ts">
    import type { Player } from "$lib/types/newTypes";
	import { onMount } from "svelte";
    export let player: Player | null;
    
    let card_type: string = "bronze";
    onMount(() => {
        if (player) {
            if (player.price > 4000 && player.price < 5000) {
                card_type = "silver";
            }
            if (player.price >= 5000) {
                card_type = "gold";
            }
        }
	});
</script>

<div class="structure">
    <div class="relative w-full h-96 bg-primary-color">
        <img src="/{card_type}back.png" alt="bronze" class="w-full h-full object-cover"/>
        <div class="w-60 absolute bottom-0 left-1/2 -translate-x-1/2">
            <img src="/profile/placeholder.png" alt="head"/>
        </div>
    </div>
    <div class="w-full flex flex-col items-center space-y-4 pb-12 border-b-4 border-secondary-light">
        <h1>{player?.name}</h1>
        <h2>{player?.price}</h2>
    </div>
    <div class="w-full flex flex-row">
        <h3 class="grow">Goals</h3>
        <h3 class="grow text-end">{player?.goals}</h3>
    </div>
    <div class="w-full flex flex-row">
        <h3 class="grow">Assist</h3>
        <h3 class="grow text-end">{player?.assist}</h3>
    </div>
    <div class="w-full flex flex-row">
        <h3 class="grow">Clutch</h3>
        <h3 class="grow text-end">{player?.clutch}</h3>
    </div>
</div>