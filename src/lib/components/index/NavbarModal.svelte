<script lang="ts">
	import type { MainRoute } from '$lib/shared/routes';
	import ArrowRightIcon from 'virtual:icons/ph/arrow-right';

	export let routes: MainRoute[];
	export let showMobileNavbar: boolean;

	$: navbarAnimation = `${showMobileNavbar ? 'translate-x-0' : 'translate-x-full'}`;
</script>

<div class="flex flex-col fixed bottom-0 top-0 right-0 w-11/12 z-50 bg-team-black transition-all duration-500 {navbarAnimation}">
	<button type="button" class="self-end p-6 hover:cursor-pointer" on:click={() => (showMobileNavbar = false)}>
		<ArrowRightIcon class="text-2xl" />
	</button>
	<div class="flex flex-col gap-6">
		{#each routes as route}
			<div class="border-b">
				<a class="text-lg" href={route.route.url} on:mouseup={() => (showMobileNavbar = false)}>
					{route.route.name}
				</a>
				<div class={`grid grid-cols-2 px-12 gap-4 pt-6 ${route.subRoute.length > 0 ? 'pb-6' : ''}`}>
					{#each route.subRoute as subRoute}
						<div class="col-span-1 py-2">
							<a class="text-lg p-0 w-1/2" href={subRoute.url} on:mouseup={() => (showMobileNavbar = false)}>
								{subRoute.name}
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
