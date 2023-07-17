<script lang="ts">
	import KrakeroyKommune from '$lib/shared/krakeroyKommune.svelte';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
	import { afterUpdate } from 'svelte';
	import ContentFooter from './ContentFooter.svelte';
	import { isInViewport } from '$lib/shared/isInView';

	// Apply animation/movement as a tailwind class
	let curPitchInView = false;
	$: pitchVisibleAnimation = `transition-all duration-500 ${
		curPitchInView ? "opacity-100" : "opacity-0"
	}`;

	// Handle checking if the element is present after scrolling
	let animatedPitch: any;
	afterUpdate(() => {
		let divRect = animatedPitch.getBoundingClientRect();
		let newPitchInView = isInViewport(divRect);
		if (newPitchInView != curPitchInView) {
			curPitchInView = newPitchInView;
		}
	});
	let y = 0;
</script>

<div class="w-full overflow-x-hidden">
	
	<div class="structure">
		<LargeLogo />

		<div class="relative w-[80%] tablet:w-[60%]">
			<KrakeroyKommune />

			<div
			class="absolute w-4/5 top-[10%] left-[10%] flex flex-col space-y-2 tablet:space-y-6 laptop:space-y-10"
			>
				<h3 class="font-bold text-center">Velkommen til Fantasy Futsal!</h3>
				<p>
					Sesongen starter 1.desember og da vil du få muligheten til å bygge ditt
					eget lag.
				</p>
				<p>
					Den 24.desember 2023 braker det løs, både i Blomsterøyhallen og Casa
					Bjerkholt. Du må derfor være ferdig med å bygge laget ditt innen den
					tid.
				</p>
				<p class="text-center pt-4 tablet:pt-16 laptop:pt-24">
					Masse lykke til med årets sesong!
				</p>
				<p class="text-center">Spell og ha det gøy!</p>
			</div>
		</div>

		<div class="relative w-[80%] {pitchVisibleAnimation}" bind:this={animatedPitch}>
			<img src="crown_top.png" alt="crown" />
			<div>
				<h3 class="text-center">Regler</h3>
				<ol class="list-decimal list-inside">
					<li> Poengfordelingen lyder: 				
						<ul class="list-disc list-inside pl-4">
							<li> 3 poeng ved mål </li>
							<li> 2 poeng ved assist </li>
							<li> 1 poeng ved redning </li>
						</ul> 
					</li>
					<li>
						Kampens dommer velge å gi 1 - 3 poeng ved C-momenter (utenom Jørgen)
					</li>
					<li>
						Det skal konsumeres en enhet per kamp
					</li>
					<li>
						Jada jada ..
					</li>
				</ol>
			</div>
			<img src="crown_bot.png" alt="crown" />
		</div>
	</div>

	<ContentFooter />

</div>

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={y} />