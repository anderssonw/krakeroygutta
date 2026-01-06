<script lang="ts">
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import type { SeasonAndTeamPlayerFull } from '$lib/types/player';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import type { Season } from '$lib/types/database-helpers';

	interface Props {
		playerSeasons: SeasonAndTeamPlayerFull[];
		currentSeason: Season | null;
		seasons: Season[];
	}

	let { playerSeasons, currentSeason, seasons }: Props = $props();
</script>

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
