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
    <div class="flex flex-col items-center">
        <h3 class="text-center text-secondary-color-light mb-2">
            <span class="border-2 rounded-lg px-6">0</span>
        </h3>

        <div>
            <Card player={player} card_size={CARD_SIZE.SMALL} season={season}/>
        </div>
            
        <div class="flex flex-row space-x-2">
            <FantasyCardButtons bind:fantasyForm={fantasyForm} player={player} position={position} />
        </div>
    </div>
{:else}
    <div class="flex flex-col items-center">
        <div class="clickable-card" on:mouseup={() => (fantasyForm.selectedCardPosition = position)}>
            <Card player={player} card_size={CARD_SIZE.SMALL} season={season}/>
        </div>
    </div>
{/if}