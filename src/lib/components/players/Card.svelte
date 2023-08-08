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
    <img src="/cards/{card_type}.png" alt="gold" class="group-hover:drop-shadow-{card_type}" />
    <div class="h-26 w-36 absolute top-[17.3%] right-[10%]">
        <img src="/profile/placeholder.png" alt="head" />
        <div class="absolute top-[94%] bg-gradient-to-t from-slate-950/25 to-transparent w-[100%] h-2"></div>
    </div>
    
    <div class="w-full absolute top-[10%] right-[25%]">
        <h1 class="text-center text-primary-color">50</h1>
    </div>

    <div class="w-full absolute top-[55%]">
        <h4 class="text-center text-primary-color">{player.name}</h4>
    </div>

    <div class="w-full absolute top-[69%] right-[20%]">
        <h5 class="text-center text-primary-color">50 ATK</h5>
    </div>
    <div class="w-full absolute top-[79%] right-[20%]">
        <h5 class="text-center text-primary-color">50 DEF</h5>
    </div>
    <div class="w-full absolute top-[69%] left-[20%]">
        <h5 class="text-center text-primary-color">50 PHY</h5>
    </div>
    <div class="w-full absolute top-[79%] left-[22%]">
        <h5 class="text-center text-primary-color">50 MOR</h5>
    </div>
</div>