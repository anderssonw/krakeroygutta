<script lang="ts">
	import pirateMadsSrc from '$lib/assets/speechbubble/madsBubble2.png';
	import TextField from '$lib/components/common/TextField.svelte';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import type { Bet } from '$lib/types/newTypes';
	import BetInfo from '$lib/components/bets/BetInfo.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	import { isSeasonPastDeadline } from '$lib/shared/SeasonFunctions';
	export let data: PageData;

	$: ({ user, bets, season } = data);

	const speechBubbleText: string[] = [
		'Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.',
		'De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.',
		'Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.'
	];

    function betExists() {
        return (bets?.filter(b => b.better?.id == user?.id).length > 0) ? true : false;
    }
    function placedBet(bet: Bet, user_id: string) {
        return bet.challengers.filter(c => c.id == user_id).length > 0;
    }
</script>

<div class="structure">
    <h1> Veddemål </h1>
    <RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} mirror={true} />

    {#if !betExists() && season && !isSeasonPastDeadline(season)}
        <h3> Opprett ett veddemål </h3>
        <form class="form" method="POST" action="?/createBet">
            <div class="form-structure">
                <TextField header="Veddemål" label="bet" placeholder="Jeg vedder .." type="text" />
                <TextField header="Sats" label="value" placeholder="50" type="number" />
                <div>
                    <input type="submit" class="btn" value={'Send inn'} />
                </div>
            </div>
        </form>
    {/if}

    <h3> Eksisterende veddemål </h3>
    <div class="w-full grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 place-items-center gap-y-16">
        {#each bets as bet}
            <div class="w-60 tablet:w-80 h-full p-4 bg-secondary-color-light text-primary-color-dark drop-shadow-[0_15px_10px_rgba(0,0,0,0.75)]">
                <BetInfo bet={bet} />
                {#if season && !isSeasonPastDeadline(season)}
                <form method="POST" class="flex justify-center">
                    {#if bet.better?.id == user?.id }
                        <button type="submit" class="btn-dark" formaction="?/removeBet">
                            Fjern veddemål
                        </button>
                    {:else}
                        <button type="submit" class="btn-dark" 
                            formaction={placedBet(bet, user?.id ?? '') ? "?/removeBetAgainst" : "?/addBetAgainst"}>
                            {placedBet(bet, user?.id ?? '') ? "Fjern utfordring" : "Utfordre"}
                        </button>
                    {/if}
                    <input type="hidden" name="bet_id" bind:value={bet.id} />
                </form>
                {/if}
            </div>
        {/each}
    </div>
</div>