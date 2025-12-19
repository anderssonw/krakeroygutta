<script lang="ts">
	import type { PageProps } from './$types';
	import { getVisibleRoutes } from '$lib/routing';
	import SubRouteCards from '$lib/components/SubRouteCard.svelte';

	let { data }: PageProps = $props();

	const adminRoutes = $derived(getVisibleRoutes(data.profile).find((route) => route.visibility === 'admin')?.subRoutes ?? []);
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 md:px-6">
	<div class="mb-8 space-y-2">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Adminpanel</h1>
		<p class="text-muted-foreground">Administrer alle aspekter av Kråkerøygutta</p>
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each adminRoutes as route}
			<SubRouteCards {route} />
		{/each}
	</div>
</div>
