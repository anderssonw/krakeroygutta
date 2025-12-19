<script lang="ts">
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from '../profil/$types';

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
				<div class="rounded-lg border bg-card p-4">
					<p class="text-sm text-muted-foreground">Kallenavn</p>
					<p class="text-md font-semibold">{profile.nickname}</p>
				</div>
				{#if profile.is_admin || profile.is_superadmin}
					<div class="rounded-lg border bg-card p-4">
						<p class="text-sm text-muted-foreground">Rolle</p>
						<p class="text-md font-semibold">
							{profile.is_superadmin ? 'Superadmin' : 'Admin'}
						</p>
					</div>
				{/if}
				{#if profile.player_id}
					<div class="rounded-lg border bg-card p-4">
						<p class="text-sm text-muted-foreground">Spiller ID</p>
						<p class="text-md font-semibold">{profile.player_id}</p>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	{#await Promise.all([playerSeasons, seasons, currentSeason]) then [playerSeasons, seasons, currentSeason]}
		{#if !playerSeasons || playerSeasons.length === 0}
			<Card.Root>
				<Card.Content class="py-12 text-center">
					<p class="text-muted-foreground">Ingen spillerdata tilgjengelig.</p>
				</Card.Content>
			</Card.Root>
		{:else}
			{#if currentSeason}
				{@const currentSeasonPlayer = playerSeasons.find((p) => p.season_id === currentSeason.id)}
				{#if currentSeasonPlayer}
					<div class="mb-8 flex flex-col items-center">
						<div class="mb-6 flex items-center justify-between">
							<h2 class="text-2xl font-bold">{currentSeason.name}</h2>
						</div>
						<PlayerCard player={currentSeasonPlayer} size="sm" />
					</div>
				{/if}
			{/if}

			{@const previousSeasons = seasons.filter((s) => s.id !== currentSeason?.id)}
			{#if previousSeasons.length > 0}
				<div class="mb-8">
					<h2 class="mb-4 text-2xl font-bold">Tidligere sesonger</h2>
					<Accordion.Root type="single" class="w-full">
						{#each previousSeasons as season}
							{@const seasonPlayer = playerSeasons.find((p) => p.season_id === season.id)}
							{#if seasonPlayer}
								<Accordion.Item value={season.id.toString()} class="border-b">
									<Accordion.Trigger class="text-lg font-semibold hover:no-underline">
										{season.name}
									</Accordion.Trigger>
									<Accordion.Content class="flex justify-center">
										<PlayerCard player={seasonPlayer} size="sm" />
									</Accordion.Content>
								</Accordion.Item>
							{/if}
						{/each}
					</Accordion.Root>
				</div>
			{/if}
		{/if}
	{/await}

	<!-- Logout Section -->
	<div class="mt-6 flex justify-center pt-8">
		<form method="POST">
			<Button type="submit" variant="outline" size="lg">Logg ut</Button>
		</form>
	</div>
</div>
