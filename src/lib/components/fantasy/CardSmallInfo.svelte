<script lang="ts">
	import type { Player } from "$lib/types/newTypes";
	import { afterUpdate } from "svelte";

    export let player: Player;
    
    let card_type: string = "bronze";
    afterUpdate(() => {
        if (player.pid){
            if (player.price > 4000 && player.price < 5000) {
                card_type = "silver";
            }
            if (player.price >= 5000) {
                card_type = "gold";
            }
        }
	});
</script>


<img src="/cards/{card_type}.png" alt="card" />

<div class="w-16 absolute top-[19%] right-[10%]">
    <img src="/profile/placeholder.png" alt="head" />
    <div class="absolute top-[86%] bg-gradient-to-t from-slate-950/25 to-transparent w-[100%] h-2"></div>
</div>
<div class="w-full absolute top-[5%] right-[25%]">
    <p class="text-center text-primary-color text-3xl">50</p>
</div>
<div class="w-full absolute top-[51%]">
    <p class="text-center text-primary-color text-xl">{player.name.split(" ")[1]}</p>
</div>

<div class="w-full absolute top-[67%] right-[23%]">
    <p class="text-center text-primary-color text-sm">50 ATK</p>
</div>
<div class="w-full absolute top-[77%] right-[23%]">
    <p class="text-center text-primary-color text-sm">50 DEF</p>
</div>
<div class="w-full absolute top-[67%] left-[23%]">
    <p class="text-center text-primary-color text-sm">50 PHY</p>
</div>
<div class="w-full absolute top-[77%] left-[26%]">
    <p class="text-center text-primary-color text-sm">50 MOR</p>
</div>