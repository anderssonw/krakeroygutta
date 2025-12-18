<script lang="ts">
	import type { PageProps } from './$types';
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import { getPlayerAverage } from '$lib/player';
	import Spinner from '$lib/components/Spinner.svelte';
	import MadsSpeechBubble from '$lib/components/MadsSpeechBubble.svelte';

	let { data }: PageProps = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">Lag og spillere</h1>
		<p class="mt-2 text-muted-foreground">Oversikt over alle lag og deres spillere for sesongen</p>
	</div>

	<MadsSpeechBubble madsVersion="fiesta" class="mb-8">
		<p>
			Her finner du lagene til årets futsal turnering.
			<br />
			Alle lag skal møte opp i klær som tilsvarer lagets farge.
			<br />
			Om du ikke har fargen tilgjengelig hjemme, så må du høre med andre om du kan låne.
		</p>
	</MadsSpeechBubble>

	{#await data.teams}
		<div class="flex items-center justify-center py-12">
			<Spinner size="lg" />
		</div>
	{:then teams}
		{#if teams.length === 0}
			<div class="rounded-lg border bg-card p-12 text-center">
				<p class="text-muted-foreground">Ingen lag funnet for denne sesongen.</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each teams as team}
					<div class="rounded-lg border bg-card p-6">
						<div class="mb-6 flex items-center gap-3">
							<div
								class="h-8 w-8 shrink-0 rounded-full border border-border"
								style={team.color ? `background-color: ${team.color};` : ''}
							></div>
							<h2 class="text-2xl font-bold">{team.name}</h2>
						</div>
						{#if team.players.length === 0}
							<p class="text-center text-muted-foreground">Ingen spillere på dette laget.</p>
						{:else}
							{@const sortedPlayers = [...team.players].sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))}
							<div class="flex flex-row flex-wrap justify-center gap-3 md:gap-4">
								{#each sortedPlayers as player}
									<PlayerCard {player} size="sm" />
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{:catch error}
		<div class="rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
			<p class="text-destructive">Kunne ikke laste lag: {error.message}</p>
		</div>
	{/await}
</div>
