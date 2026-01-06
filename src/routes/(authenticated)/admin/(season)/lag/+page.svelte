<script lang="ts">
	import type { PageProps } from './$types';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { colorMap } from '$lib/colors';
	import IconPlus from '~icons/lucide/plus';
	import IconTrash from '~icons/lucide/trash';
	import IconUsers from '~icons/lucide/users';
	import { page } from '$app/state';
	import { toasts } from '$lib/stores/toast';
	import { enhance } from '$app/forms';
	import PlayerImageAvatar from '$lib/components/PlayerImageAvatar.svelte';

	let { data }: PageProps = $props();

	let { teams, players } = $derived(data);

	let createTeamDialogOpen = $state(false);
	let addPlayerDialogOpen = $state(false);
	let selectedTeamId = $state<number | undefined>(undefined);
	let teamName = $state('');
	let teamColor = $state('blue');
	let selectedPlayerId = $state<string | undefined>(undefined);

	// Get players not yet assigned to any team
	const availablePlayers = $derived(
		players.filter((p) => {
			return !teams.some((team) => team.players.some((teamPlayer) => teamPlayer.player_id === p.player_id));
		})
	);

	$effect(() => {
		if (!createTeamDialogOpen) {
			teamName = '';
			teamColor = 'blue';
		}
	});

	$effect(() => {
		if (!addPlayerDialogOpen) {
			selectedPlayerId = undefined;
			selectedTeamId = undefined;
		}
	});

	function openAddPlayerDialog(teamId: number) {
		selectedTeamId = teamId;
		addPlayerDialogOpen = true;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Lag</h1>
				<p class="mt-2 text-muted-foreground">Administrer lag og spillere for sesongen</p>
			</div>
			<Button onclick={() => (createTeamDialogOpen = true)}>
				<IconPlus class="mr-2 h-4 w-4" />
				Nytt lag
			</Button>
		</div>
	</div>

	{#if teams.length === 0}
		<Card>
			<CardContent class="py-12 text-center">
				<p class="text-muted-foreground">Ingen lag funnet for denne sesongen.</p>
			</CardContent>
		</Card>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each teams as team (team.id)}
				<Card>
					<CardHeader>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="h-4 w-4 rounded-full" style="background-color: {team.color};"></div>
								<CardTitle>{team.name}</CardTitle>
							</div>
							<form
								action="?/deleteTeam"
								method="post"
								use:enhance={() => {
									return async ({ result, update }) => {
										if (result.type == 'success') {
											toasts.add('Lag slettet!', 'success');
										} else {
											toasts.add('Noe gikk galt ved sletting av lag.', 'error');
										}
										update();
									};
								}}
							>
								<input type="hidden" name="teamId" value={team.id} />
								<Button type="submit" variant="ghost" size="sm">
									<IconTrash class="h-4 w-4" />
								</Button>
							</form>
						</div>
					</CardHeader>
					<CardContent>
						<div class="mb-4">
							<div class="flex items-center justify-between text-sm text-muted-foreground">
								<div class="flex items-center gap-1">
									<IconUsers class="h-4 w-4" />
									<span>{team.playerCount} spillere</span>
								</div>
								<Button size="sm" variant="outline" onclick={() => openAddPlayerDialog(team.id)}>
									<IconPlus class="mr-1 h-3 w-3" />
									Legg til
								</Button>
							</div>
						</div>
						{#if team.players.length > 0}
							<div class="space-y-2">
								{#each team.players as player (player.id)}
									<div class="flex items-center justify-between rounded-lg border p-2">
										<div class="flex items-center gap-2">
											<PlayerImageAvatar src={player.image} size="sm" />
											<span class="text-sm">{player.name}</span>
										</div>
										<form
											action="?/removePlayerFromTeam"
											method="post"
											use:enhance={() => {
												return async ({ result, update }) => {
													if (result.type == 'success') {
														toasts.add('Spiller fjernet fra lag!', 'success');
													} else {
														toasts.add('Noe gikk galt ved fjerning av spiller.', 'error');
													}
													update();
												};
											}}
										>
											<input type="hidden" name="teamPlayerId" value={player.id} />
											<Button type="submit" variant="ghost" size="sm">
												<IconTrash class="h-3 w-3" />
											</Button>
										</form>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-center text-sm text-muted-foreground">Ingen spillere på laget ennå</p>
						{/if}
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}
</div>

<!-- Create Team Dialog -->
<Dialog.Root bind:open={createTeamDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Opprett nytt lag</Dialog.Title>
			<Dialog.Description>Legg til et nytt lag for sesongen.</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/createTeam"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type == 'success') {
						toasts.add('Lag opprettet!', 'success');
						createTeamDialogOpen = false;
					} else {
						toasts.add('Noe gikk galt ved opprettelse av lag.', 'error');
					}
					update();
				};
			}}
		>
			<input type="hidden" name="seasonId" value={page.url.searchParams.get('seasonId')} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="team-name">Lagnavn</Label>
					<Input id="team-name" name="name" bind:value={teamName} placeholder="Blå lag" required />
				</div>
				<div class="grid gap-2">
					<Label for="team-color">Farge</Label>
					<Select.Root type="single" name="color" value={teamColor} onValueChange={(v) => (teamColor = v ?? 'blue')}>
						<Select.Trigger class="w-full" id="team-color">
							<div class="flex items-center gap-2">
								<div class="h-3 w-3 rounded-full" style="background-color: {colorMap[teamColor]};"></div>
								<span class="capitalize">{teamColor}</span>
							</div>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Farger</Select.Label>
								{#each Object.keys(colorMap) as color (color)}
									<Select.Item value={color} label={color}>
										<div class="flex items-center gap-2">
											<div class="h-3 w-3 rounded-full" style="background-color: {colorMap[color]};"></div>
											<span class="capitalize">{color}</span>
										</div>
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (createTeamDialogOpen = false)}>Avbryt</Button>
				<Button type="submit" disabled={!teamName}>Opprett lag</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Add Player to Team Dialog -->
<Dialog.Root bind:open={addPlayerDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Legg til spiller</Dialog.Title>
			<Dialog.Description>Velg en spiller å legge til på laget.</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/addPlayerToTeam"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type == 'success') {
						toasts.add('Spiller lagt til lag!', 'success');
						addPlayerDialogOpen = false;
					} else if (result.type === 'failure') {
						const message = result.data?.message ?? 'Noe gikk galt ved tillegging av spiller.';
						toasts.add(message as string, 'error');
					} else {
						toasts.add('Noe gikk galt ved tillegging av spiller.', 'error');
					}
					update();
				};
			}}
		>
			<input type="hidden" name="teamId" value={selectedTeamId} />
			<div class="grid gap-4 py-4">
				<div class="grid gap-2">
					<Label for="player">Spiller</Label>
					<Select.Root type="single" name="playerId" value={selectedPlayerId} onValueChange={(v) => (selectedPlayerId = v)}>
						<Select.Trigger class="w-full" id="player">
							{availablePlayers.find((p) => p.player_id.toString() === selectedPlayerId)?.name ?? 'Velg spiller'}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Spillere</Select.Label>
								{#if availablePlayers.length === 0}
									<div class="px-2 py-1.5 text-sm text-muted-foreground">Alle spillere er allerede på lag</div>
								{:else}
									{#each availablePlayers as player (player.player_id)}
										<Select.Item value={player.player_id.toString()} label={player.name}>
											<div class="flex items-center gap-2">
												<PlayerImageAvatar src={player.image} size="sm" />
												{player.name}
											</div>
										</Select.Item>
									{/each}
								{/if}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (addPlayerDialogOpen = false)}>Avbryt</Button>
				<Button type="submit" disabled={!selectedPlayerId}>Legg til spiller</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
