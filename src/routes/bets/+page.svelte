<script lang="ts">
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';
	import pirateMadsSrc from '$lib/assets/piratmads.png';
	import TextField from '$lib/shared/TextField.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	import BetRow from '$lib/components/bets/BetRow.svelte';
	export let data: PageData;

	$: ({ user, bets } = data);

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
                <TextField label="Veddemål" placeholder="Jeg vedder .." type="text" />
                <TextField label="Sats" placeholder="50" type="number" />
                <div>
                    <input type="submit" class="btn" value={'Send inn'} />
                </div>
            </div>
        </form>
    {/if}

    <h3> Eksisterende veddemål </h3>
    <div class="w-full flex flex-col">
        {#each bets as bet}
            <BetRow bet={bet} user_id={user?.id ?? ''} />
        {/each}
    </div>
</div>
