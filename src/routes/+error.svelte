<script lang="ts">
	import { page } from '$app/stores';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import pirateMadsSrc from '$lib/assets/piratmads.png';
</script>

<div class="structure text-center">
	<h1>Det ser ut som noe har gått galt!</h1>

	<h2>Feil kan alltid skje, så for å hjelpe oss gjøre siden bedre kan du ta skjermbilde av meldingen under Mads</h2>

	<RuleSpeechBubble
		mirror
		imageSrc={pirateMadsSrc}
		text="Husk å være snill med Magnus og William, selv om ikke alt alltid går på skinner. Det kan være vanskelig å lage gode nettsider!"
	/>

	<h4>{$page.error?.devHelper}</h4>

	<p>{$page.error?.message}</p>
</div>
