<script lang="ts">
    import type { FantasyForm, Player } from "$lib/types/newTypes";
	import { afterUpdate } from "svelte";
    export let player: Player;
    export let fantasyForm: FantasyForm;

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

    function buyPlayer(player: Player) {
        fantasyForm.team[fantasyForm.selectedCard] = player;
        fantasyForm.selectedCard = -1;
        fantasyForm.money -= player.price;
    }
</script>

<div class="relative w-24 tablet:w-40 laptop:w-48 hover:scale-105 active:scale-100 flex flex-col items-center group hover:cursor-pointer" on:mouseup={() => buyPlayer(player)}>
    <img src="/{card_type}.png" alt="gold" />
    <div class="w-[50%] absolute top-[23%] right-[10%]">
        <img src="/profile/placeholder.png" alt="head" />
    </div>

    <div class="w-full absolute top-[55%]">
        <p class="text-center text-primary-color text-xs tablet:text-sm laptop:text-base">{player.name}</p>
        <p class="text-center text-primary-color text-2xs tablet:text-xs laptop:text-sm">{player.price}</p>
    </div>
</div>