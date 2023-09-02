<script lang="ts">
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';
	import pirateMadsSrc from '$lib/assets/piratmads.png';
	import TextField from '$lib/shared/TextField.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ bets } = data);

	const speechBubbleText: string[] = [
		'Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.',
		'De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.',
		'Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.'
	];

    let bet: string;
    let value: string;
</script>

<div class="structure">
    <button on:click={() => console.log(bets)}>CLICK</button>

    <h1> Bets </h1>
    <RuleSpeechBubble imageSrc={pirateMadsSrc} text={speechBubbleText} mirror={true} />

    <h3> Opprett ett veddemål </h3>
    <form class="form">
		<div class="form-structure">
            <TextField label="Veddemål" placeholder="Jeg vedder .." type="text" value={bet} />
            <TextField label="Sats" placeholder="50" type="number" value={value} />
        </div>
    </form>

    <h3> Eksisterende veddemål </h3>
    <div class="w-full flex flex-col">
        {#each bets as bet}
            <div class="flex flex-row">
                <div class="w-5/12 bg-secondary-color-light p-6 text-primary-color-dark rounded-tl-3xl rounded-tr-3xl rounded-br-3xl">
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
                        <li> {bet.user_id} </li>
                    </ul> 
                </div>

                <div class="w-7/12">
                    {#each bet.bets_against as bet_against}
                        <p>
                            {bet_against.challenger}
                        </p>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
