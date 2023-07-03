<script lang="ts">
	import { goto } from "$app/navigation";
    import type { Player } from "$lib/types/newTypes";
	import { onMount } from "svelte";
    export let player: Player;

    let card_type: string = "bronze";
    onMount(() => {
        if (player.price > 4000 && player.price < 5000) {
            card_type = "silver";
        }
        if (player.price >= 5000) {
            card_type = "gold";
        }
	});
</script>

<div class="relative w-60 hover:scale-105 active:scale-100 flex flex-col items-center group hover:cursor-pointer" on:mouseup={() => goto(`/players/${player.pid}`)}>
    <img src="{card_type}.png" alt="gold" class="group-hover:drop-shadow-{card_type}" />
    <div class="h-26 w-32 absolute top-[21.36%] right-[10%]">
        <img src="/profile/placeholder.png" alt="head" />
    </div>
    <div class="w-full absolute top-[55%]">
        <h4 class="text-center text-primary-color">{player.name}</h4>
        <h5 class="text-center text-primary-color">{player.price}</h5>
    </div>
</div>