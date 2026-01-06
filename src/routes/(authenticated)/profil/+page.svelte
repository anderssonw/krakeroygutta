<script lang="ts">
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from '../profil/$types';
	import PlayerSeasons from '$lib/components/PlayerSeasons.svelte';

	let { data }: PageProps = $props();

	let { profile, playerSeasons, seasons, currentSeason } = $derived(data);
</script>

<div class="container mx-auto px-4 py-8 md:px-16">
	<p class="mb-4 text-center text-muted-foreground">Velkommen tilbake, {profile.nickname}!</p>

	<Card.Root class="mb-8">
		<Card.Header>
			<Card.Title class="text-xl">Profilinformasjon</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#snippet profileInfo(label: string, text: string | number)}
					<div class="rounded-lg border bg-card p-4">
						<p class="text-sm text-muted-foreground">{label}</p>
						<p class="text-md font-semibold">{text}</p>
					</div>
				{/snippet}
				{@render profileInfo('Kallenavn', profile.nickname)}
				{#if profile.is_admin || profile.is_superadmin}
					{@render profileInfo('Rolle', profile.is_superadmin ? 'Superadmin' : 'Admin')}
				{/if}
				{#if profile.player_id}
					{@render profileInfo('Spiller ID', profile.player_id)}
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	{#await Promise.all([playerSeasons, seasons, currentSeason]) then [playerSeasons, seasons, currentSeason]}
		{#if playerSeasons}
			<PlayerSeasons {playerSeasons} {seasons} {currentSeason} />
		{:else}
			<p class="text-center text-muted-foreground">Ingen spillerdata tilgjengelig.</p>
		{/if}
	{/await}

	<!-- Logout Section -->
	<div class="mt-6 flex justify-center pt-8">
		<form method="POST">
			<Button type="submit" variant="outline" size="lg">Logg ut</Button>
		</form>
	</div>
</div>
