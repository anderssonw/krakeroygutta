<script lang="ts">
	import MatchCard from '$lib/components/MatchCard.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let { matches } = $derived(data);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Kamper</h1>
				<p class="mt-2 text-muted-foreground">Oversikt over alle kamper i sesongen</p>
			</div>
		</div>
	</div>

	{#if matches.length === 0}
		<Card>
			<CardContent class="py-12 text-center">
				<p class="text-muted-foreground">Ingen kamper funnet for denne sesongen.</p>
			</CardContent>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each matches as match, index (match.id)}
				<MatchCard {match} matchNumber={matches.length - index} />
			{/each}
		</div>
	{/if}
</div>
