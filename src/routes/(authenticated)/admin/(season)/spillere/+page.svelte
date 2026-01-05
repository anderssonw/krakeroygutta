<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { PageProps } from './$types';
	import * as Accordion from '$lib/components/ui/accordion';
	import PlayerImageAvatar from '$lib/components/PlayerImageAvatar.svelte';
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import EmptyPlayerCard from '$lib/components/PlayerCards/EmptyPlayerCard.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';
	import { cn } from '$lib/utils';

	let { data }: PageProps = $props();

	let { players } = $derived(data);

	const currentSeasonPlayers = $derived(players.filter((p) => p.currentSeasonInfo !== null));

	const seasonId = $derived($page.url.searchParams.get('seasonId'));
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Spillere</h1>
				<p class="mt-2 text-muted-foreground">Oversikt over alle spillere i sesongen</p>
			</div>
		</div>
	</div>

	<Card>
		<CardContent class="p-0">
			{#if players.length === 0}
				<p class="py-12 text-center text-muted-foreground">Ingen spillere funnet for denne sesongen.</p>
			{:else}
				<Accordion.Root type="single" class="w-full">
					<Accordion.Item value="velg-spillere" class="border-b-0">
						<Accordion.Trigger class="px-6 py-4 text-left font-semibold hover:no-underline">Velg spillere for sesongen</Accordion.Trigger>
						<Accordion.Content class="px-6 pb-6">
							<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
								{#each players as player (player.id)}
									{@const isInSeason = player.currentSeasonInfo !== null}
									<form
										method="POST"
										action={isInSeason ? '?/removePlayerFromSeason' : '?/addPlayerToSeason'}
										use:enhance={() => {
											const isRemoving = isInSeason;
											return async ({ result, update }) => {
												if (result.type == 'success') {
													if (isRemoving) {
														toasts.add('Spiller fjernet fra sesongen!', 'success');
													} else {
														toasts.add('Spiller lagt til sesongen!', 'success');
													}
												} else {
													toasts.add('Noe gikk galt.', 'error');
												}
												update();
											};
										}}
									>
										<input type="hidden" name="playerId" value={player.id} />
										<input type="hidden" name="seasonId" value={seasonId} />
										<button
											type="submit"
											class={cn(
												'flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
												isInSeason
													? 'border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900'
													: 'border-muted bg-background hover:bg-muted/50'
											)}
										>
											<PlayerImageAvatar src={player.image} alt={player.name} size="sm" />
											<span class="font-medium">{player.name}</span>
											{#if isInSeason}
												<span class="ml-auto text-xs text-green-700 dark:text-green-400">I sesong</span>
											{/if}
										</button>
									</form>
								{/each}
							</div>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="rediger-spillere" class="border-b-0">
						<Accordion.Trigger class="px-6 py-4 text-left font-semibold hover:no-underline">
							Rediger spillere for sesongen
						</Accordion.Trigger>
						<Accordion.Content class="px-6 pb-6">
							<div class="space-y-8">
								{#each currentSeasonPlayers as player (player.id)}
									<form
										method="POST"
										action="?/updatePlayerForSeason"
										class="space-y-4 rounded-lg border p-6"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type == 'success') {
													toasts.add('Spiller oppdatert!', 'success');
												} else if (result.type == 'failure') {
													toasts.add('Noe gikk galt ved oppdatering av spiller: ' + result.data?.message, 'error');
												}
												update();
											};
										}}
									>
										<input type="hidden" name="playerId" value={player.id} />
										<input type="hidden" name="seasonId" value={seasonId} />

										<h3 class="text-xl font-semibold">{player.name}</h3>

										<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div class="space-y-2">
												<h4 class="text-center text-sm font-medium text-muted-foreground">Forrige sesong</h4>
												<div class="flex justify-center">
													{#if player.previousSeasonInfo}
														<PlayerCard player={player.previousSeasonInfo} size="sm" />
													{:else}
														<EmptyPlayerCard size="sm" disabled={true} />
													{/if}
												</div>
											</div>

											<div class="space-y-2">
												<h4 class="text-center text-sm font-medium text-muted-foreground">Nåværende sesong</h4>
												<div class="flex justify-center">
													{#if player.currentSeasonInfo}
														<PlayerCard isEditable player={player.currentSeasonInfo} size="sm" />
													{/if}
												</div>
											</div>
										</div>

										<div class="space-y-4 pt-4">
											<div class="space-y-2">
												<Label for="inform-{player.id}">Inform bilde URL</Label>
												<Input
													id="inform-{player.id}"
													name="inform_image"
													type="url"
													placeholder="https://..."
													value={player.currentSeasonInfo?.inform_image ?? ''}
												/>
											</div>

											<div class="space-y-2">
												<Label for="outofform-{player.id}">Out of form bilde URL</Label>
												<Input
													id="outofform-{player.id}"
													name="outofform_image"
													type="url"
													placeholder="https://..."
													value={player.currentSeasonInfo?.outofform_image ?? ''}
												/>
											</div>

											<Button type="submit" class="w-full">Lagre endringer</Button>
										</div>
									</form>
								{/each}
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/if}
		</CardContent>
	</Card>
</div>
