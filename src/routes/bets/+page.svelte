<script lang="ts">
	import RuleSpeechBubble from '$lib/components/RuleSpeechBubble.svelte';
	import pirateMadsSrc from '$lib/assets/piratmads.png';
	import TextField from '$lib/shared/TextField.svelte';

	const speechBubbleText: string[] = [
		'Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.',
		'De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.',
		'Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.'
	];

    let bet: string;
    let value: string;
</script>

<div class="structure">
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
        <div class="w-1/3 bg-secondary-color-light p-6 text-primary-color-dark rounded-tl-3xl rounded-tr-3xl rounded-br-3xl">
            Veddemål: 				
            <ul class="list-disc list-inside pl-4">
                <li> Jørgen scorer mindre enn 5 mål i løpet av sesongen </li>
            </ul>
            Sats: 				
            <ul class="list-disc list-inside pl-4">
                <li> 50 kr </li>
            </ul> 
            Eier: 				
            <ul class="list-disc list-inside pl-4">
                <li> Eirik Stormoen </li>
            </ul> 
        </div>
    </div>
</div>
