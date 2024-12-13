<script lang="ts">
	import KrakeroyKommune from '$lib/components/index/krakeroyKommune.svelte';
	import { afterUpdate } from 'svelte';
	import ContentFooter from '$lib/components/index/ContentFooter.svelte';
	import { isInViewport } from '$lib/shared/isInView';
	import LargeLogo from '$lib/components/common/LargeLogo.svelte';
	import crownTop from '$lib/assets/crown_top.png';
	import crownBot from '$lib/assets/crown_bot.png';

	import type { PageData } from './$types';
	export let data: PageData;

	$: ({ session } = data);

	// Apply animation/movement as a tailwind class
	let curPitchInView = false;
	$: pitchVisibleAnimation = `transition-all duration-500 ${curPitchInView ? 'opacity-100' : 'opacity-0'}`;

	// Handle checking if the element is present after scrolling
	let animatedPitch: any;
	afterUpdate(() => {
		let divRect = animatedPitch.getBoundingClientRect();
		let newPitchInView = isInViewport(divRect, 600);
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

			<div class="absolute w-4/5 top-[6%] tablet:top-[10%] left-[10%] flex flex-col space-y-6 tablet:space-y-8 laptop:space-y-10">
				<p class="font-bold text-center text-base tablet:text-xl laptop:text-3xl">Velkommen til Fantasy Futsal!</p>
				<p class="text-xs tablet:text-base laptop:text-xl">
					Fra og med 19. desember vil det være mulig å opprette ditt helt egne fantasylag.
				</p>
				<p class="text-xs tablet:text-base laptop:text-xl">
					Den 21.desember 2024 braker det løs, både i Blomsterøyhallen og Casa Bjerkholt. Klokken 11:00 samme dag vil det ikke lenger være
					mulig å endre på laget sitt.
				</p>
				<div>
					<p class="text-center pt-4 tablet:pt-24 laptop:pt-32 text-base tablet:text-xl laptop:text-2xl">Spell og ha det gøy!</p>
					<p class="text-center text-xs laptop:text-base">Kråkerøygutt, hei, hei, hei!</p>
				</div>
			</div>
		</div>

		<div class="relative w-[90%] {pitchVisibleAnimation}" bind:this={animatedPitch}>
			<img src={crownTop} alt="crown" />
			<div>
				<p class="text-center text-lg tablet:text-xl laptop:text-3xl">Regler</p>
				<ol class="list-decimal list-inside flex flex-col gap-4">
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

	<ContentFooter isLoggedIn={session != null} />
</div>

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={y} />
