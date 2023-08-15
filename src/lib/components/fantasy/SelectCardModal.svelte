<script lang="ts">
    import type { FantasyForm, Player } from "$lib/types/newTypes";
	import SelectCard from "./SelectCard.svelte";

    export let players: Player[];
    export let fantasyForm: FantasyForm;
    export let hasCardSelected: boolean;

    // Apply animation
	$: selectionVisible = `transition-all duration-500 ${
            hasCardSelected ? "block opacity-100" : "invisible opacity-0"
        }`;
    $: backgroundChange = `transition-all duration-1000 ${
            hasCardSelected ? "bg-black/75" : "bg-black/0"
        }`;
    $: playerSlide = `transition-all duration-1000 ${
            hasCardSelected ? "translate-y-0" : "translate-y-full"
        }`;
</script>

<div class="fixed bottom-0 top-0 right-0 left-0 z-50 {selectionVisible} {backgroundChange}">
    <div class="fixed top-20 right-20 hover:cursor-pointer">
        <h2 on:mouseup={() => fantasyForm.selectedCard = -1 }>X</h2>
    </div>
    <div class="max-w-screen-laptop h-3/4 p-8 bg-primary-color-dark/50 rounded-lg fixed m-auto inset-x-0 inset-y-0 overflow-y-scroll">
        <div class="w-full flex flex-row flex-wrap gap-8 justify-center {playerSlide}">
            {#each players as player}
                <SelectCard player={player} bind:fantasyForm={fantasyForm} />
            {/each}
        </div>
    </div>
</div>