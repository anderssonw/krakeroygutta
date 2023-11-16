<script lang="ts">
	import KrakeroyKommune from '$lib/components/index/krakeroyKommune.svelte';
	import { afterUpdate } from 'svelte';
	import ContentFooter from './ContentFooter.svelte';
	import { isInViewport } from '$lib/shared/isInView';
	import LargeLogo from '../common/LargeLogo.svelte';
	import crownTop from '$lib/assets/crown_top.png';
	import crownBot from '$lib/assets/crown_bot.png';

	// Apply animation/movement as a tailwind class
	let curPitchInView = false;
	$: pitchVisibleAnimation = `transition-all duration-500 ${curPitchInView ? 'opacity-100' : 'opacity-0'}`;

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
	<div class="structure space-y-10">
		<LargeLogo />

		<div class="relative w-[80%] tablet:w-[60%]">
			<KrakeroyKommune />

			<div class="absolute w-4/5 top-[6%] tablet:top-[10%] left-[10%] flex flex-col space-y-2 tablet:space-y-8 laptop:space-y-10">
				<h3 class="font-bold text-center">Velkommen til Fantasy Futsal!</h3>
				<p>Fra og med 1. desember vil det være mulig å opprette ditt helt egne fantasylag.</p>
				<p>
					Den 16.desember 2023 braker det løs, både i Blomsterøyhallen og Casa Bjerkholt. Klokken 12:00 samme dag vil det ikke lenger være
					mulig å endre på laget sitt.
				</p>
				<h5 class="text-center pt-8 tablet:pt-24 laptop:pt-32">Spell og ha det gøy!</h5>
				<h6 class="text-center">Kråkerøygutt, hei, hei, hei!</h6>
			</div>
		</div>

		<div class="relative w-[90%] {pitchVisibleAnimation}" bind:this={animatedPitch}>
			<img src={crownTop} alt="crown" />
			<div>
				<h3 class="text-center">Regler</h3>
				<ol class="list-decimal list-inside">
					<li>
						Poengfordelingen lyder:
						<ul class="list-disc list-inside pl-4">
							<li>3 poeng ved seier</li>
							<li>3 poeng ved mål</li>
							<li>2 poeng ved assist</li>
							<li>1 poeng ved clean sheet</li>
							<li>1 poeng ved c-moment</li>
						</ul>
					</li>
					<li>
						Alle lag skal ha en førings-ansvarlig. Disse står ansvarlig for å føre mål, assists og selvfølgelig C-momenter. Ved C-momenter
						er det føringsansvarlig, gjerne med bistand fra resten av gutta, som har til rådighet å gi poeng for vel... C-momenter
					</li>
					<li>
						Det skal etter beste evne konsumeres én enhet a 0.33L ved hver kamp spilt. Husk at banespy fort gjelder som C-moment! (Og
						poentiselt værre fysikk-score ved neste års Fantasy)
					</li>
					<li>Når du velger laget ditt skal du også velge en kaptein. Kapteinen din vil få doblet score blant alle poenggivninger</li>
				</ol>
			</div>
			<img src={crownBot} alt="crown" />
		</div>
	</div>

	<ContentFooter />
</div>

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={y} />
