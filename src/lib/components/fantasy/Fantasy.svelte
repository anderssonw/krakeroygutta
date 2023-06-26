<script lang="ts">
	import SpinnerIcon from "$lib/shared/spinnerIcon.svelte";
    import type { Player, User } from "$lib/types/newTypes";
	import { onMount } from "svelte";

    export let players: Player[];
    export let user: User;

    let myPlayers: Player[] = [];
    let otherPlayers: Player[] = [];
    let myCurrency: number;
    let myCaptain: number = -1;

    let isLoadingPage: boolean = true;
    onMount(() => {
        myPlayers = players.filter(player => user.players.includes(player.pid))
        otherPlayers = players.filter(player => !user.players.includes(player.pid))
        myCurrency = JSON.parse(JSON.stringify(user.cash)); // Deep copy to not disturb db data (?)

		isLoadingPage = false;
	});


    function buyPlayer(player: Player){
        // Check currency
        if (myCurrency >= player.price) {
            // Remove currency
            myCurrency -= player.price;

            // Add to my players
            myPlayers.push(player);
            myPlayers = myPlayers;

            // Remove from other players
            otherPlayers = otherPlayers.filter(p => p.pid != player.pid);
        } else {
            /* TODO: Handle it better */
            alert("Not enough money")
        }
    }
    function sellPlayer(player: Player){
        // Add currency
        myCurrency += player.price;

        // Add to my players
        otherPlayers.push(player);
        otherPlayers = otherPlayers;

        // Remove from other players
        myPlayers = myPlayers.filter(p => p.pid != player.pid);
    }

    function selectCaptain(idx: number) {
        if (myPlayers[idx]){
            if (myCaptain == idx){
                myCaptain = -1;
            } else {
                myCaptain = idx;
            }
        }
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
                <div class="player bottom-24 left-1/2 -translate-x-1/2" on:mouseup={() => selectCaptain(0)}>
                    {#if myPlayers[0]}
                        <img src="/profile/{myPlayers[0].image}" alt="head" class="z-10">
                    {/if}
                    {#if myCaptain == 0}
                        <div class="absolute top-6 w-full bg-yellow-500 opacity-90 h-5 z-20 text-center text-sm"> CAP</div>
                    {/if}
                </div>
                <div class="player top-1/2 left-16 -translate-y-1/2" on:mouseup={() => selectCaptain(1)}>
                    {#if myPlayers[1]}
                        <img src="/profile/{myPlayers[1].image}" alt="head" class="z-10">
                    {/if}
                    {#if myCaptain == 1}
                        <div class="absolute top-6 w-full bg-yellow-500 opacity-90 h-5 z-20 text-center text-sm"> CAP</div>
                    {/if}
                </div>
                <div class="player top-1/2 right-16 -translate-y-1/2" on:mouseup={() => selectCaptain(2)}>
                    {#if myPlayers[2]}
                        <img src="/profile/{myPlayers[2].image}" alt="head" class="z-10">
                    {/if}
                    {#if myCaptain == 2}
                        <div class="absolute top-6 w-full bg-yellow-500 opacity-90 h-5 z-20 text-center text-sm"> CAP</div>
                    {/if}
                </div>
                <div class="player top-24 left-1/2 -translate-x-1/2" on:mouseup={() => selectCaptain(3)}>
                    {#if myPlayers[3]}
                        <img src="/profile/{myPlayers[3].image}" alt="head" class="z-10">
                    {/if}
                    {#if myCaptain == 3}
                        <div class="absolute top-6 w-full bg-yellow-500 opacity-90 h-5 z-20 text-center text-sm"> CAP</div>
                    {/if}
                </div>
            </div>
            <div class="w-full tablet:w-1/2">
                <ol>
                    {#each players as player}
                        <li>
                            {player.name} {player.price},- 
                            {#if myPlayers.some(p => p.pid == player.pid)}
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