<script lang="ts">
	import type { Bet } from "../../../routes/bets/+page.server";
    import type { TablesInsert } from '$lib/types/database.helper.types';
	import { fail } from '@sveltejs/kit';
	import type { SupabaseClient } from "@supabase/supabase-js";

    export let bet: Bet; 
    export let user_id: string;
    export let supabase: SupabaseClient;

    function myBet(bet_id: string | undefined, user_id: string) {
        return bet_id === user_id;
    }
    function placedBet(bet: Bet, user_id: string) {
        return bet.challengers.filter(c => c.user.id == user_id).length > 0;
    }

    /* CAN WE MOVE THIS TO +page.server.ts ?? */
    async function addBetAgainst(bet_id: number, user_id: string) {
        // Using a GENERIC INSERT where id is optional
        const betAgainstForm: TablesInsert<'bets_against'> = {
            bet_id: bet_id,
            user_id: user_id,
        }

        const { error: error } = await supabase.from('bets_against').insert(betAgainstForm);

        if (error) {
            return fail(500, {
                supabaseErrorMessage: error.message
            });
        }

        location.reload();
    }
    async function removeBetAgainst(user_id: string) {
        const { error: error } = await supabase.from('bets_against').delete().eq('user_id', user_id);

        if (error) {
            return fail(500, {
                supabaseErrorMessage: error.message
            });
        }

        location.reload();
    }
</script>

<div class="flex flex-row">
    <div class="w-6/12 tablet:w-4/12 bet relative group
        {myBet(bet.user?.id, user_id) 
            ? 'order-2 rounded-br-none rounded-bl-3xl' 
            : 'order-1'}">

        <div class="group-hover:opacity-25">
            Veddemål: 				
            <ul class="list-disc list-inside pl-4">
                <li> {bet.bet} </li>
            </ul>
            Sats: 	
            <ul class="list-disc list-inside pl-4">
                <li> {bet.value} kr </li>
            </ul> 
            Eier: 				
            <ul class="list-disc list-inside pl-4">
                <li> {bet.user?.nickname} </li>
            </ul>
        </div>

        <div class="hidden group-hover:block">
            <div class="center">
                {#if myBet(bet.user?.id, user_id)}
                    <button class="btn">
                        Fjern
                    </button>
                {:else}
                    {#if placedBet(bet, user_id)}
                        <button class="btn" on:click={() => removeBetAgainst(user_id)}>
                            Fjern utfordring
                        </button>
                    {:else}
                        <button class="btn" on:click={() => addBetAgainst(bet.id, user_id)}>
                            Utfordre
                        </button>
                    {/if}
                {/if}
            </div>
        </div>
    </div>

    
    <div class="w-7/12 {myBet(bet.user?.id, user_id) ? 'order-1' : 'order-2'}">
        {#each bet.challengers as challenger}
            <p>
                {challenger.user.nickname}
            </p>
        {/each}
    </div>
</div>