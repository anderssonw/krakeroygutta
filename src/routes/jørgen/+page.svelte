<script lang="ts">
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import pirateMadsSrc from '$lib/assets/speechbubble/madsBubble2.png';
</script>

<div class="structure text-center">
	<h1>Det ser ut som noe har gått galt!</h1>

	<RuleSpeechBubble
		mirror
		imageSrc={pirateMadsSrc}
		text="Siden du forsøker å laste er ALT for stor, og kan dermed ikke vises. Sjekk følgende lenker for hjelp: www.gastricbypass.com www.onlinedietician.com"
	/>
</div>
