<script lang="ts">
    import type { Player } from "$lib/types/newTypes";
	import { onMount } from "svelte";
    export let player: Player | null;
    export let position: number;
    export let isSelectingPlayer: boolean;
    export let playerIndex: number;

    let card_type: string = "bronze";
    onMount(() => {
        if (player){
            if (player.price > 4000 && player.price < 5000) {
                card_type = "silver";
            }
            if (player.price >= 5000) {
                card_type = "gold";
            }
        }
	});

    function handleCardClick() {
        isSelectingPlayer = true;
        playerIndex = position;
    }
</script>

<div 
    class="w-32 hover:scale-105 active:scale-100 flex flex-col items-center group drop-shadow-card hover:cursor-pointer"
    on:mouseup={() => handleCardClick() }>
    {#if !player || player == null}
        <img src="/EmptyCard.png" alt="empty" />
    {:else}
        <img src="/gold.png" alt="gold" />
        <div class="w-[50%] absolute top-[23%] right-[10%]">
            <img src="/profile/placeholder.png" alt="head" />
        </div>

        <div class="w-full absolute top-[55%]">
            <p class="text-center text-primary-color text-xs tablet:text-sm laptop:text-base">{player.name}</p>
            <p class="text-center text-primary-color text-2xs tablet:text-xs laptop:text-sm">{player.price}</p>
        </div>
    {/if}
</div>