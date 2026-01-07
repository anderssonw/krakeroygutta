<script lang="ts">
	import PlayerSeasons from '$lib/components/PlayerSeasons.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto max-w-7xl px-4 py-6">
	{#await Promise.all([data.playerSeasons, data.seasons])}
		<div class="flex items-center justify-center py-12">
			<Spinner size="lg" />
		</div>
	{:then [playerSeasons, seasons]}
		{#if playerSeasons && playerSeasons.length > 0}
			<div class="mb-6 pb-4">
				<h1 class="text-center text-3xl font-bold md:text-4xl">
					Spillerside {playerSeasons[0].name}
				</h1>
			</div>
			<div class="rounded-lg border-2 border-border bg-card p-4 shadow-lg md:p-6">
				<PlayerSeasons {playerSeasons} {seasons} currentSeason={data.currentSeason} showStats={true} />
			</div>
		{:else}
			<div class="rounded-lg border-2 border-border bg-card p-8 text-center">
				<p class="text-muted-foreground">Ingen spillerdata tilgjengelig.</p>
			</div>
		{/if}
	{:catch _}
		<div class="rounded-lg border-2 border-destructive bg-card p-8 text-center">
			<p class="text-destructive">En feil oppstod ved lasting av spillerdata.</p>
		</div>
	{/await}
</div>
