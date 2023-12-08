<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { isInViewport } from "$lib/shared/isInView";
	import { afterUpdate } from 'svelte';
	import squadLeft from '$lib/assets/SquadLeft.png';
	import squadRight from '$lib/assets/SquadRight.png';

	// Apply animation/movement as a tailwind class
	let curPitchInView = false;
	$: squadLeftAnimation = `transition-all duration-1000 ${
		curPitchInView ? "translate-x-0" : "-translate-x-full"
	}`;
	$: squadRightAnimation = `transition-all duration-1000 ${
		curPitchInView ? "translate-x-0" : "translate-x-full"
	}`;

	// Handle checking if the element is present after scrolling
	let animatedPitch: any;
	afterUpdate(() => {
		if(animatedPitch) {
			let divRect = animatedPitch.getBoundingClientRect();
			let newPitchInView = isInViewport(divRect, 200);
			if (newPitchInView != curPitchInView) {
				curPitchInView = newPitchInView;
			}
		}
	});
	
	let y = 0;
</script>

<div class="relative h-60 w-full mt-4 tablet:mt-32 laptop:mt-60" bind:this={animatedPitch}>
	<div class="absolute left-0 bottom-0 w-40 tablet:w-2/6 {squadLeftAnimation}">
		<img src={squadLeft} alt="left squad" />
	</div>

	<div class="flex flex-col items-center h-[100%] translate-y-0 tablet:-translate-y-4 laptop:-translate-y-12">
		<h3 class="mb-2 tablet:mb-4">Hvem tar du med deg?</h3>
		<button class="btn" on:click={() => goto("/register")}>
			Kom i gang!
		</button>
	</div>

	<div class="absolute right-0 bottom-0 w-40 tablet:w-2/6 {squadRightAnimation}">
		<img src={squadRight} alt="right squad" />
	</div>
</div>

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={y} />