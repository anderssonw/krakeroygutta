<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Bet } from "../../../routes/bets/+page.server";
	import type { TablesInsert } from "$lib/types/database.helper.types";
	import { fail } from "@sveltejs/kit";

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

        // CHECK IF PERSON HAR ALREADY PLACED BET TO BE SAFE
        const { error: error } = await supabase.from('bets_against').insert(betAgainstForm);

        if (error) {
            return fail(500, {
                supabaseErrorMessage: error.message
            });
        }

        // Alternatives?
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
    async function removeBet(user_id: string) {
        const { error: error } = await supabase.from('bets').delete().eq('user_id', user_id);

        if (error) {
            return fail(500, {
                supabaseErrorMessage: error.message
            });
        }

        location.reload();
    }
</script>

<div class="w-80 p-4 bg-secondary-color-light text-primary-color-dark drop-shadow-[0_15px_10px_rgba(0,0,0,0.75)]">
    <div>
        <h1 class="text-center pb-12"> LOGO </h1>
    </div>

    <div class="p-4 border-b-2 border-primary-color-dark">
        <p> {bet.bet} </p>
    </div>

    <div class="p-4 border-b-2 border-primary-color-dark flex justify-between">
        <p>Sats</p>
        <p>{bet.value} kr</p>
    </div>

    <div class="py-4 grid grid-cols-2 gap-4">
        <div class="flex flex-col justify-end">
            <div class="border-b-2 border-primary-color-dark">
                <p class="italic text-center"> {bet.user.nickname} </p>
            </div>
            <p class="text-sm font-bold text-center">Eier</p>
        </div>
        <div class="flex flex-col justify-end">
            <div class="border-b-2 border-primary-color-dark">
                {#each bet.challengers as challenger}
                    <p class="italic text-center"> {challenger.user.nickname} </p>
                {/each}
            </div>
            <p class="text-sm font-bold text-center">Byder</p>
        </div>
    </div>

    <div class="flex justify-center">
        {#if myBet(bet.user?.id, user_id)}
            <button class="btn-dark" on:click={() => removeBet(user_id)}>
                Fjern veddemål
            </button>
        {:else}
            <button class="btn-dark" on:click={() => {
                    placedBet(bet, user_id) ? removeBetAgainst(user_id) : addBetAgainst(bet.id, user_id)
                }}>
                {placedBet(bet, user_id) ? 'Fjern utfordring' : 'Utfordre'}
            </button>
        {/if}
    </div>

</div>