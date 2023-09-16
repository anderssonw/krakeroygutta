<script lang="ts">
	import { CARD_SIZE } from "$lib/shared/playerCardFunctions";
	import type { Tables } from "$lib/types/database.helper.types";
	import type { FantasyForm, FullPlayer } from "$lib/types/newTypes";
	import Card from "../cards/Card.svelte";
	import FantasyCardButtons from "./FantasyCardButtons.svelte";

    export let player: FullPlayer | null;
	export let fantasyForm: FantasyForm;
	export let position: number;
    export let season: Tables<'seasons'> | null;
</script>


{#if player}
    <div class="clickable-card active:scale-105 player-{position} relative">
        <h3 class="text-center text-secondary-color-light mb-2">
            <span class="border-2 rounded-lg px-8">0</span>
        </h3>

        <Card player={player} card_size={CARD_SIZE.MEDIUM} season={season}/>
        
        <div class="absolute left-full top-16 flex flex-col space-y-1">
            <FantasyCardButtons bind:fantasyForm={fantasyForm} player={player} position={position} />
        </div>
    </div>
{:else}
    <div class="clickable-card player-{position}" on:mouseup={() => (fantasyForm.selectedCardPosition = position)}>
        <Card player={player} card_size={CARD_SIZE.MEDIUM} season={season}/>
    </div>
{/if}