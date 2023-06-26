<script lang="ts">
	import SpinnerIcon from "$lib/shared/spinnerIcon.svelte";
    import type { Player, User } from "$lib/types/newTypes";
	import { onMount } from "svelte";

    export let players: Player[];
    export let user: User;

    let myPlayers: Player[] = [];
    let otherPlayers: Player[] = [];
    let myCurrency: number;

    let isLoadingPage: boolean = true;
    onMount(() => {
        myPlayers = players.filter(player => user.PlayerIDs.includes(player.PlayerID))
        otherPlayers = players.filter(player => !user.PlayerIDs.includes(player.PlayerID))
        myCurrency = JSON.parse(JSON.stringify(user.Currency)); // Deep copy to not disturb db data (?)

		isLoadingPage = false;
	});


    function buyPlayer(player: Player){
        // Check currency
        if (myCurrency >= player.Price) {
            // Remove currency
            myCurrency -= player.Price;

            // Add to my players
            myPlayers.push(player);
            myPlayers = myPlayers;

            // Remove from other players
            otherPlayers = otherPlayers.filter(p => p.PlayerID != player.PlayerID);
        } else {
            /* TODO: Handle it better */
            alert("Not enough money")
        }
    }
    function sellPlayer(player: Player){
        // Add currency
        myCurrency += player.Price;

        // Add to my players
        otherPlayers.push(player);
        otherPlayers = otherPlayers;

        // Remove from other players
        myPlayers = myPlayers.filter(p => p.PlayerID != player.PlayerID);
    }
</script>

<div class="structure">
    {#if isLoadingPage}
        <SpinnerIcon />
    {:else}
        <h2> Mitt fantasy </h2>
        <h3> My currency: {myCurrency} </h3>
        <div class="w-full bg-primary-color flex flex-col tablet:flex-row">
            <div class="relative w-full tablet:w-1/2">
                <img src="Field.png" alt="field" />
                <div class="w-20 h-20 rounded-full bg-primary-color-light absolute bottom-24 left-1/2 -translate-x-1/2 overflow-hidden">
                    {#if myPlayers[0]}
                        <img src={myPlayers[0].Picture} alt="head">
                    {/if}
                </div>
                <div class="w-20 h-20 rounded-full bg-primary-color-light absolute top-1/2 left-16 -translate-y-1/2 overflow-hidden">
                    {#if myPlayers[1]}
                        <img src={myPlayers[1].Picture} alt="head">
                    {/if}
                </div>
                <div class="w-20 h-20 rounded-full bg-primary-color-light absolute top-1/2 right-16 -translate-y-1/2 overflow-hidden">
                    {#if myPlayers[2]}
                        <img src={myPlayers[2].Picture} alt="head">
                    {/if}
                </div>
                <div class="w-20 h-20 rounded-full bg-primary-color-light absolute top-24 left-1/2 -translate-x-1/2 overflow-hidden">
                    {#if myPlayers[3]}
                        <img src={myPlayers[3].Picture} alt="head">
                    {/if}
                </div>
            </div>
            <div class="w-full tablet:w-1/2">
                <ol>
                    {#each players as player}
                        <li>
                            {player.Name} {player.Price},- 
                            {#if myPlayers.some(p => p.PlayerID == player.PlayerID)}
                                <button class="btn" on:click={() => sellPlayer(player)}>SELL</button>
                            {:else}
                                <button class="btn" on:click={() => buyPlayer(player)}>BUY</button>
                            {/if}
                        </li>
                    {/each}
                </ol>
            </div>
        </div>
        <button class="btn"> SAVE </button>
    {/if}
</div>