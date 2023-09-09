<script lang="ts">
	import pirateMadsSrc from '$lib/assets/piratmads.png';
	import TextField from '$lib/components/common/TextField.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	import Bet from '$lib/components/bets/Bet.svelte';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	export let data: PageData;

	$: ({ user, bets, supabase } = data);

	const speechBubbleText: string[] = [
		'Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.',
		'De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.',
		'Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.'
	];

    function betExists() {
        return (bets?.filter(b => b.user?.id == user?.id).length > 0) ? true : false;
    }
</script>

<div class="structure">
    <h1> Bets </h1>
    <RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} mirror={true} />

    {#if !betExists()}
        <h3> Opprett ett veddemål </h3>
        <form class="form" method="POST">
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
            <Bet bet={bet} user_id={user?.id ?? ''} supabase={supabase} />
        {/each}
    </div>
</div>
