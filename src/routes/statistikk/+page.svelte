<script lang="ts">
	import { goto } from '$app/navigation';
	import PlayerImage from '$lib/components/PlayerImage.svelte';
	import FantasyPickList from './FantasyPickList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Handle season selection change
	function handleSeasonChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const seasonId = select.value;
		goto(`/statistikk?season=${seasonId}`);
	}
</script>

{#if !data.season}
	<div class="container mx-auto p-8">
		<h1 class="text-3xl font-bold">Ingen sesong funnet</h1>
		<p class="mt-4 text-muted-foreground">Velg en sesong for å se statistikk.</p>
	</div>
{:else}
	<div class="container mx-auto p-4 md:p-8">
		<div class="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-2xl font-bold md:text-4xl">{data.season.name}</h1>
				<p class="mt-1 text-sm text-muted-foreground md:mt-2">
					{data.season.start_time.toLocaleDateString('nb-NO')} - {data.season.end_time.toLocaleDateString('nb-NO')}
				</p>
			</div>

			<!-- Season Selector -->
			{#if data.allSeasons.length > 1}
				<div>
					<label for="season-select" class="mb-2 block text-sm font-medium">Velg sesong</label>
					<select
						id="season-select"
						onchange={handleSeasonChange}
						value={data.season.id}
						class="w-full rounded-lg border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:w-auto"
					>
						{#each data.allSeasons as season}
							<option value={season.id}>{season.name}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>

		<!-- Player Scores Table -->
		<div class="mb-8 md:mb-12">
			<h2 class="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">🏆 Spillerpoeng</h2>

			<!-- Desktop Table -->
			<div class="hidden overflow-x-auto rounded-lg border bg-card md:block">
				<table class="w-full">
					<thead class="border-b bg-muted/50">
						<tr>
							<th class="px-6 py-4 text-left text-sm font-semibold">#</th>
							<th class="px-6 py-4 text-left text-sm font-semibold">Spiller</th>
							<th class="px-6 py-4 text-center text-sm font-semibold">
								<div class="flex items-center justify-center gap-1">
									<div class="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-300">
										M
									</div>
									<span>×{data.season.points_per_goal}</span>
								</div>
							</th>
							<th class="px-6 py-4 text-center text-sm font-semibold">
								<div class="flex items-center justify-center gap-1">
									<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300">A</div>
									<span>×{data.season.points_per_assist}</span>
								</div>
							</th>
							<th class="px-6 py-4 text-center text-sm font-semibold">
								<div class="flex items-center justify-center gap-1">
									<div class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-300">
										C
									</div>
									<span>×{data.season.points_per_clutch}</span>
								</div>
							</th>
							<th class="px-6 py-4 text-right text-sm font-semibold">Totalt Poeng</th>
						</tr>
					</thead>
					<tbody>
						{#each data.players as player, i}
							<tr class="border-b last:border-b-0 hover:bg-muted/30">
								<td class="px-6 py-4 text-muted-foreground">{i + 1}</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<PlayerImage src={player.image} alt={player.name} size="md" />
										<span class="font-medium">{player.name}</span>
									</div>
								</td>
								<td class="px-6 py-4 text-center">
									<span class="text-base font-semibold text-green-300">
										{player.goals}
									</span>
								</td>
								<td class="px-6 py-4 text-center">
									<span class="text-base font-semibold text-blue-300">
										{player.assists}
									</span>
								</td>
								<td class="px-6 py-4 text-center">
									<span class="text-base font-semibold text-orange-300">
										{player.clutches}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<span class="text-2xl font-bold">{player.totalScore}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Mobile Cards -->
			<div class="space-y-3 md:hidden">
				{#each data.players as player, i}
					<div class="rounded-lg border bg-card p-4">
						<div class="mb-3 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="text-lg font-semibold text-muted-foreground">#{i + 1}</span>
								<PlayerImage src={player.image} alt={player.name} size="md" />
								<span class="font-medium">{player.name}</span>
							</div>
							<span class="text-xl font-bold">{player.totalScore}</span>
						</div>
						<div class="grid grid-cols-3 gap-2 text-sm">
							<div class="flex items-center gap-2 rounded bg-muted/30 p-2">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-300">M</div>
								<div class="flex-1">
									<div class="text-xs text-muted-foreground">×{data.season.points_per_goal}</div>
									<div class="font-semibold">{player.goals}</div>
								</div>
							</div>
							<div class="flex items-center gap-2 rounded bg-muted/30 p-2">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">A</div>
								<div class="flex-1">
									<div class="text-xs text-muted-foreground">×{data.season.points_per_assist}</div>
									<div class="font-semibold">{player.assists}</div>
								</div>
							</div>
							<div class="flex items-center gap-2 rounded bg-muted/30 p-2">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-300">
									C
								</div>
								<div class="flex-1">
									<div class="text-xs text-muted-foreground">×{data.season.points_per_clutch}</div>
									<div class="font-semibold">{player.clutches}</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Fantasy Pick Statistics -->
		<div class="mb-8 md:mb-12">
			<h2 class="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">📊 Fantasy Popularitet</h2>
			<div class="grid gap-4 md:gap-8 lg:grid-cols-2">
				<!-- Most Picked -->
				<div class="rounded-lg border bg-card p-6">
					<h3 class="mb-4 text-xl font-bold">⭐ Mest Valgte Spillere</h3>
					<FantasyPickList picks={data.fantasyPickStats.mostPicked} />
				</div>

				<!-- Least Picked -->
				<div class="rounded-lg border bg-card p-6">
					<h3 class="mb-4 text-xl font-bold">😢 Minst Valgte Spillere</h3>
					<FantasyPickList picks={data.fantasyPickStats.leastPicked} />
				</div>
			</div>
		</div>
	</div>
{/if}
