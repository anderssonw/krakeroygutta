<script lang="ts">
	import type { Bet } from "$lib/types/newTypes";
    import betLogo from '$lib/assets/bets/bet_logo.png';

    export let bet: Bet;
</script>

<div class="flex flex-col items-center mb-8">
    <img class="w-[40%]" src={betLogo} alt="bet_logo" />
    <div class="text-2xs">Stolt sponsor av Fantasy Futsal</div>
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
            <p class="italic text-center"> {bet.better?.name} </p>
        </div>
        <p class="text-sm font-bold text-center">Eier</p>
    </div>
    <div class="flex flex-col justify-end">
        <div class="border-b-2 border-primary-color-dark">
            {#each bet.challengers as challenger}
                <p class="italic text-center"> {challenger?.name} </p>
            {/each}
        </div>
        <p class="text-sm font-bold text-center">Byder</p>
    </div>
</div>