<script lang="ts">
	import { goto } from "$app/navigation";
    import type { FantasyForm, Player } from "$lib/types/newTypes";
	import CardSmallInfo from "./CardSmallInfo.svelte";

    export let player: Player;
    export let fantasyForm: FantasyForm;
    export let position: number;

    let card_type: string = "bronze";

    function handleCardClick() {
        fantasyForm.selectedCard = position;
    }

    function handleCaptainClick(pid: number) {
        fantasyForm.captain = pid;
    }

    function sellPlayer (player: Player) {
        fantasyForm.team[position] = {} as Player;
        fantasyForm.cash += player.price;
    }
</script>


{#if !player.pid}
    <div class="small-card" on:mouseup={() => handleCardClick() }>
        <img src="/cards/empty.png" alt="card" />
    </div>
{:else}    
    <div class="small-card group">

        <CardSmallInfo player={player} />

        <div class="w-40 absolute left-[100%] hidden group-hover:block group-hover:animate-fadeIn z-100">
            <button class="btn w-full mb-1" on:click={() => sellPlayer(player) }>Selg spiller</button>
            <button class="btn w-full mb-1" on:click={() => handleCaptainClick(player ? player.pid : 0)} >Velg kaptein</button>
            <a href="/players/{player.pid}" target="_blank" rel="noreferrer" class="p-0"> <button class="btn w-full mb-1">Statistikk</button> </a>
        </div>
    </div>
{/if}