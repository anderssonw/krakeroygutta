<script lang="ts">
    import type { FantasyForm, Player } from "$lib/types/newTypes";
	import { afterUpdate } from "svelte";
    export let player: Player;
    export let fantasyForm: FantasyForm;
    export let position: number;

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

    function handleCardClick() {
        fantasyForm.selectedCard = position;
    }

    function handleCaptainClick(pid: number) {
        fantasyForm.captain = pid;
    }

    function sellPlayer (player: Player) {
        fantasyForm.team[position] = {} as Player;
        fantasyForm.money += player.price;
    }
</script>

<div 
    class="tablet:w-24 laptop:w-32 flex flex-col items-center group drop-shadow-card hover:cursor-pointer player-{position}">
    {#if player.pid}
        <div class="hover:scale-105 active:hover:scale-100" on:mouseup={() => sellPlayer(player) }>
            <img src="/{card_type}.png" alt="gold" />
            <div class="w-[50%] absolute top-[23%] right-[10%]">
                <img src="/profile/placeholder.png" alt="head" />
            </div>

            <div class="w-full absolute top-[55%]">
                <p class="text-center text-primary-color text-xs tablet:text-sm laptop:text-base">{player.name}</p>
                <p class="text-center text-primary-color text-2xs tablet:text-xs laptop:text-sm">
                    {player.price}
                </p>
            </div>
        </div>

        <div class="w-32 absolute left-[100%] top-[15%]">       
            <p class="text-center">Poeng: 2</p>
            {#if player.pid == fantasyForm.captain}
                <button class="btn w-full text-sm bg-secondary-color-dark">Kaptein</button>
            {:else}
                <button class="btn w-full text-sm" on:click={() => handleCaptainClick(player ? player.pid : 0)}>Velg kaptein</button>
            {/if}
        </div>
    {:else}
        <div class="hover:scale-105 active:hover:scale-100" on:mouseup={() => handleCardClick() }>
            <img src="/EmptyCard.png" alt="empty" />
        </div>
    {/if}
</div>