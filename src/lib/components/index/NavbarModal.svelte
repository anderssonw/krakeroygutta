<script lang="ts">
	import type { Route } from '$lib/shared/routes';
	import ArrowRightIcon from 'virtual:icons/ph/arrow-right';

	export let routes: Route[];
	export let showMobileNavbar: boolean;

	$: navbarAnimation = `${showMobileNavbar ? 'translate-x-0' : 'translate-x-full'}`;
</script>

<div class="flex flex-col fixed bottom-0 top-0 right-0 w-3/4 z-50 bg-secondary-color-dark transition-all duration-500 {navbarAnimation}">
	<button type="button" class="self-end text-black p-6 hover:cursor-pointer" on:click={() => (showMobileNavbar = false)}>
		<ArrowRightIcon class="text-2xl" />
	</button>
	<div class="flex flex-col">
		{#each routes as route}
			<a class="text-center px-4 py-0 my-3 text-black text-lg" href={route.route} on:mouseup={() => (showMobileNavbar = false)}>
				{route.name}
			</a>
		{/each}
	</div>
</div>
