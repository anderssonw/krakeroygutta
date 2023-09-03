<script lang="ts">
	import type { Bet } from "../../../routes/bets/+page.server";

    export let bet: Bet; 
    export let user_id: string;

    function myBet(bet_id: string | undefined, user_id: string) {
        return bet_id === user_id;
    }
</script>

<div class="flex flex-row">
    <div class="w-5/12 bet relative group
        {myBet(bet.user?.id, user_id) 
            ? 'order-2 rounded-br-none rounded-bl-3xl' 
            : 'order-1'}">

        <div class="group-hover:opacity-25">
            Veddemål: 				
            <ul class="list-disc list-inside pl-4">
                <li> {bet?.bet} </li>
            </ul>
            Sats: 	
            <ul class="list-disc list-inside pl-4">
                <li> {bet?.value} kr </li>
            </ul> 
            Eier: 				
            <ul class="list-disc list-inside pl-4">
                <li> {bet?.user?.nickname} </li>
            </ul>
        </div>

        <div class="hidden group-hover:block">
            <div class="center">
                {#if myBet(bet.user?.id, user_id)}
                    <button class="btn">
                        Fjern
                    </button>
                {:else}
                    <button class="btn">
                        Utfordre
                    </button>
                {/if}
            </div>
        </div>
    </div>

    
    <div class="w-7/12 {myBet(bet.user?.id, user_id) ? 'order-1' : 'order-2'}">
        {#each (bet.challengers ?? []) as user}
            <p>
                {user?.nickname}
            </p>
        {/each}
    </div>
</div>