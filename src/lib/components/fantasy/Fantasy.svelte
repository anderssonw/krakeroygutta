<script lang="ts">
	import SpinnerIcon from "$lib/shared/spinnerIcon.svelte";
    import type { FantasyForm, Player, User } from "$lib/types/newTypes";
	import { onMount } from "svelte";

	import TabletCard from "$lib/components/fantasy/TabletCard.svelte";
	import MobileCard from "./MobileCard.svelte";
	import SelectCardModal from "./SelectCardModal.svelte";

    export let players: Player[];
    export let user: User;

    // Initialize a form to be edited
    let fantasyForm: FantasyForm = {
        team: [{} as Player, {} as Player, {} as Player, {} as Player],
        money: -1,
        captain: -1,
        selectedCard: -1,
    }
    $: hasCardSelected = (fantasyForm.selectedCard >= 0) ? true : false;

    /* TODO: List of players updated based on USER selection and ALL available */

    // Fill up form with data from the server
    let isLoadingPage: boolean = true;
    onMount(() => {
        let myPlayers = players.filter(player => user.players.includes(player.pid))
        for (var i = 0; i < myPlayers.length; i++) {
            fantasyForm.team[i] = myPlayers[i];
        }
        fantasyForm.money = JSON.parse(JSON.stringify(user.cash));
        fantasyForm.captain = JSON.parse(JSON.stringify(user.captain));
		isLoadingPage = false;
	});

    function checkStatus() {
        console.log(fantasyForm);
    }
</script>

<SelectCardModal players={players} bind:fantasyForm={fantasyForm} bind:hasCardSelected={hasCardSelected} />


<div class="structure">
    {#if isLoadingPage}
        <SpinnerIcon />
    {:else}
        <h2> Mitt fantasy lag </h2>
        <h3> Penger: {fantasyForm.money} </h3>
        <div class="relative w-full hidden tablet:block">
            <img src="/Field.png" alt="field"/>
            {#each fantasyForm.team as player, idx}
                <TabletCard 
                    player={player}
                    position={idx} 
                    bind:fantasyForm={fantasyForm} />
            {/each}
        </div>
        <div class="relative w-full bg-primary-color block tablet:hidden">
            <!--
            {#each myTeam as player, idx}
                <MobileCard player={player} position={idx} bind:isSelectingPlayer={isSelectingPlayer} bind:playerIndex={playerIndex} />
            {/each}
            -->
        </div>
        <button class="btn" on:click={() => checkStatus()}> SAVE </button>
    {/if}
</div>