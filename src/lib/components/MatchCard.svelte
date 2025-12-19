<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import IconTrophy from '~icons/lucide/trophy';
	import IconTarget from '~icons/fluent/target-20-regular';
	import IconTargetPlus from '~icons/fluent/target-add-20-regular';
	import IconTrash from '~icons/lucide/trash-2';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import { confirmationDialog } from '$lib/stores/confirmationDialog';
	import { type Component } from 'svelte';
	import clsx from 'clsx';
	import type { MatchDetails, MatchPlayer, MatchTeam } from '$lib/types/match';
	import { Label } from './ui/label';
	import { getLastName } from '$lib/names';
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';

	interface Props {
		match: MatchDetails;
		matchNumber: number;
		isAdmin?: boolean;
	}

	let { match, matchNumber, isAdmin = false }: Props = $props();

	let clutchDialogOpen = $state(false);
	let clutchPlayerId = $state<string | undefined>(undefined);

	let goalDialogOpen = $state(false);
	let goalPlayerId = $state<string | undefined>(undefined);
	let assistPlayerId = $state<string | undefined>(undefined);

	function resetClutchForm() {
		clutchPlayerId = undefined;
	}

	function resetGoalForm() {
		goalPlayerId = undefined;
		assistPlayerId = undefined;
	}

	type PlayerCount = {
		name: string;
		count: number;
	};

	function getPlayerName(playerId: number | null): string {
		if (!playerId) return 'Ingen';
		const allPlayers = [...match.home_team.players, ...match.away_team.players];
		const player = allPlayers.find((p) => p.player_id === playerId);
		return player ? getLastName(player.name) : 'Ukjent';
	}

	function countPlayerOccurrences(playerNames: string[]): PlayerCount[] {
		const counts = playerNames.reduce((acc, name) => ({ ...acc, [name]: (acc[name] || 0) + 1 }), {} as Record<string, number>);
		return Object.entries(counts).map(([name, count]) => ({ name, count }));
	}

	function getTeamPlayerStats<T>(items: T[], team: MatchTeam, getPlayerId: (item: T) => number | null): PlayerCount[] {
		const teamPlayerIds = team.players.map((p) => p.player_id);
		const playerNames = items
			.map((item) => {
				const playerId = getPlayerId(item);
				// Only include if the player belongs to this team
				if (!playerId || !teamPlayerIds.includes(playerId)) {
					return null;
				}
				return team.players.find((p) => p.player_id === playerId)?.name ?? 'Ukjent';
			})
			.filter((name): name is string => name !== null);

		return countPlayerOccurrences(playerNames);
	}

	let homeGoals = $derived(
		match.goals.filter((goal) => match.home_team.players.map((p) => p.player_id).includes(goal.goal_player_id)).length
	);
	let awayGoals = $derived(
		match.goals.filter((goal) => match.away_team.players.map((p) => p.player_id).includes(goal.goal_player_id)).length
	);
	let homeGoalPlayers = $derived(getTeamPlayerStats(match.goals, match.home_team, (g) => g.goal_player_id));
	let awayGoalPlayers = $derived(getTeamPlayerStats(match.goals, match.away_team, (g) => g.goal_player_id));
	let homeAssistPlayers = $derived(getTeamPlayerStats(match.goals, match.home_team, (g) => g.assist_player_id));
	let awayAssistPlayers = $derived(getTeamPlayerStats(match.goals, match.away_team, (g) => g.assist_player_id));
	let homeClutchPlayers = $derived(getTeamPlayerStats(match.clutches, match.home_team, (c) => c.clutch_player_id));
	let awayClutchPlayers = $derived(getTeamPlayerStats(match.clutches, match.away_team, (c) => c.clutch_player_id));
</script>

<Card class="mx-auto max-w-md">
	<CardHeader>
		<CardTitle class="mb-2 text-center text-xs text-muted-foreground">
			Kamp {matchNumber}
		</CardTitle>

		<div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center text-sm">
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-full" style="background-color: {match.home_team.color};"></div>
				<span class="font-medium">{match.home_team.name}</span>
			</div>

			<span class="place-self-center text-sm font-bold">{homeGoals} - {awayGoals}</span>

			<div class="flex items-center gap-2 place-self-end">
				<span class="font-medium">{match.away_team.name}</span>
				<div class="h-3 w-3 rounded-full" style="background-color: {match.away_team.color};"></div>
			</div>
		</div>
	</CardHeader>

	<CardContent class="py-0">
		<Accordion.Root type="single">
			<Accordion.Item value="details">
				<Accordion.Trigger class="justify-center py-0" />
				<Accordion.Content>
					<div class="space-y-4 pt-2">
						{#if isAdmin}
							<div class="grid grid-cols-[1fr_1fr] gap-2">
								<Button variant="outline" size="sm" onclick={() => (goalDialogOpen = true)}>
									<IconTarget class="mr-2 h-4 w-4" />
									Nytt mål
								</Button>
								<Button variant="outline" size="sm" onclick={() => (clutchDialogOpen = true)}>
									<IconTrophy class="mr-2 h-4 w-4" />
									Nytt c-moment
								</Button>
							</div>
							<div class="space-y-4">
								<div class="flex flex-col gap-2">
									<div class="mb-1 flex items-center gap-2">
										<IconTarget class="h-4 w-4 text-muted-foreground" />
										<span class="text-sm font-semibold">Mål og assists</span>
									</div>
									{#each match.goals as goal}
										<div
											class="group flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
										>
											<div class="flex items-center gap-2">
												<span class="font-medium">{getPlayerName(goal.goal_player_id)}</span>
												{#if goal.assist_player_id}
													<span class="text-muted-foreground">•</span>
													<span class="text-muted-foreground">
														Assist: {getPlayerName(goal.assist_player_id)}
													</span>
												{/if}
											</div>
											<form
												action="?/deleteGoal"
												method="post"
												use:enhance={async ({ cancel }) => {
													const confirmed = await confirmationDialog.confirm({
														title: 'Slett mål?',
														description: 'Er du sikker på at du vil slette dette målet? Denne handlingen kan ikke angres.',
														confirmText: 'Slett'
													});

													if (!confirmed) {
														cancel();
													}

													return async ({ update, result }) => {
														if (result.type === 'success') {
															toasts.add('Mål slettet', 'success');
														} else {
															toasts.add('Noe gikk galt ved sletting av mål', 'error');
														}

														await update();
													};
												}}
											>
												<input type="hidden" name="goalId" value={goal.id} />
												<Button type="submit" variant="ghost" size="icon" class="h-8 w-8">
													<IconTrash class="h-4 w-4 text-destructive" />
												</Button>
											</form>
										</div>
									{:else}
										<p class="px-3 py-2 text-xs italic text-muted-foreground">Ingen mål registrert</p>
									{/each}
								</div>
								<div class="flex flex-col gap-2">
									<div class="mb-1 flex items-center gap-2">
										<IconTrophy class="h-4 w-4 text-muted-foreground" />
										<span class="text-sm font-semibold">C-momenter</span>
									</div>
									{#each match.clutches as clutch}
										<div
											class="group flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
										>
											<span class="font-medium">{getPlayerName(clutch.clutch_player_id)}</span>
											<form
												action="?/deleteClutch"
												method="post"
												use:enhance={async ({ cancel }) => {
													const confirmed = await confirmationDialog.confirm({
														title: 'Slett c-moment?',
														description: 'Er du sikker på at du vil slette dette c-momentet? Denne handlingen kan ikke angres.',
														confirmText: 'Slett'
													});

													if (!confirmed) cancel();

													return async ({ update, result }) => {
														if (result.type === 'success') {
															toasts.add('C-moment slettet', 'success');
														} else {
															toasts.add('Noe gikk galt ved sletting av c-moment', 'error');
														}
														await update();
													};
												}}
											>
												<input type="hidden" name="clutchId" value={clutch.id} />
												<Button type="submit" variant="ghost" size="icon" class="h-8 w-8">
													<IconTrash class="h-4 w-4 text-destructive" />
												</Button>
											</form>
										</div>
									{:else}
										<p class="px-3 py-2 text-xs italic text-muted-foreground">Ingen c-momenter registrert</p>
									{/each}
								</div>

								<form
									action="?/deleteMatch"
									method="post"
									class="flex justify-center"
									use:enhance={async ({ cancel }) => {
										const confirmed = await confirmationDialog.confirm({
											title: 'Slett kamp?',
											description:
												'Er du sikker på at du vil slette denne kampen? Du vil da slette alle tilhørende mål og assists i tillegg.',
											confirmText: 'Slett kamp'
										});
										if (!confirmed) {
											cancel();
										}

										return async ({ update, result }) => {
											if (result.type === 'success') {
												toasts.add('Kamp slettet', 'success');
											} else {
												toasts.add('Noe gikk galt ved sletting av kamp', 'error');
											}

											await update();
										};
									}}
								>
									<input type="hidden" name="matchId" value={match.id} />
									<Button variant="destructive" size="sm" type="submit">
										<IconTrash class="ml-2 h-4 w-4 text-destructive" />
										Slett kamp
									</Button>
								</form>
							</div>
						{:else}
							{#snippet statsSection(
								title: string,
								Icon: Component,
								homePlayers: PlayerCount[],
								awayPlayers: PlayerCount[],
								emptyText: string
							)}
								<div class="mb-2 flex items-center justify-center gap-2">
									<Icon class="h-4 w-4 text-muted-foreground" />
									<span class="text-sm font-semibold">{title}</span>
								</div>
								<div class="grid grid-cols-2 gap-4 text-sm">
									{#snippet teamColumn(players: PlayerCount[], emptyText: string, align: 'left' | 'right' = 'left')}
										<ul class={clsx('space-y-1', align === 'left' ? 'text-left' : 'text-right')}>
											{#each players as player}
												<li class={clsx('text-muted-foreground')}>
													{getLastName(player.name)}{player.count > 1 ? ` (${player.count})` : ''}
												</li>
											{:else}
												<li class={clsx('text-xs text-muted-foreground italic')}>
													{emptyText}
												</li>
											{/each}
										</ul>
									{/snippet}

									{@render teamColumn(homePlayers, emptyText)}
									{@render teamColumn(awayPlayers, emptyText, 'right')}
								</div>
							{/snippet}

							{@render statsSection('Mål', IconTarget, homeGoalPlayers, awayGoalPlayers, 'Ingen mål')}
							{@render statsSection('Assists', IconTargetPlus, homeAssistPlayers, awayAssistPlayers, 'Ingen assists')}
							{@render statsSection('C-momenter', IconTrophy, homeClutchPlayers, awayClutchPlayers, 'Ingen c-momenter')}
						{/if}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</CardContent>
</Card>

{#snippet teamRadioColumn(players: MatchPlayer[], prefix: string, radioName: string, currentValue: string | undefined, onValueChange: (value: string) => void, teamLabel: string, isDisabled?: (value: string) => boolean)}
	<div class="space-y-2">
		<Label class="text-xs font-medium text-muted-foreground">{teamLabel}</Label>
		{#each players as player}
			<label
				for={prefix + '-player-' + player.player_id}
				class={clsx(
					'flex cursor-pointer items-center gap-2 rounded-md border-2 px-3 py-2 transition-colors has-checked:bg-secondary  has-disabled:cursor-not-allowed has-disabled:opacity-50'
				)}
			>
				<input
					type="radio"
					name={radioName}
					value={player.player_id}
					disabled={isDisabled?.(String(player.player_id))}
					id={prefix + '-player-' + player.player_id}
					checked={currentValue === String(player.player_id)}
					onchange={() => onValueChange(String(player.player_id))}
					class="sr-only"
				/>
				<span class="text-sm">{getLastName(player.name)}</span>
			</label>
		{/each}
	</div>
{/snippet}

<Dialog.Root bind:open={goalDialogOpen} onOpenChange={(open) => !open && resetGoalForm()}>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Legg til nytt mål</Dialog.Title>
		</Dialog.Header>
		<form
			action="?/createGoal"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						goalDialogOpen = false;
						toasts.add('Mål opprettet!', 'success');
						resetGoalForm();
					} else {
						toasts.add('Noe gikk galt ved opprettelse av mål.', 'error');
					}
					await update();
				};
			}}
		>
			<div class="space-y-6 py-4">
				<input type="hidden" name="matchId" value={match.id} />
				<div class="block'} mb-3">
					<Label class="text-base font-semibold">Målscorer</Label>
				</div>
				<div class="grid grid-cols-[1fr_1fr] gap-4">
					{@render teamRadioColumn(
						match.home_team.players,
						`goalPlayerId-home`,
						'goalPlayerId',
						goalPlayerId,
						(v) => (goalPlayerId = v),
						'Hjemmelag'
					)}
					{@render teamRadioColumn(
						match.away_team.players,
						`goalPlayerId-away`,
						'goalPlayerId',
						goalPlayerId,
						(v) => (goalPlayerId = v),
						'Bortelag'
					)}
				</div>
			</div>

			<div class="mb-4 flex items-center justify-between">
				<Label class="text-base font-semibold">Assist (valgfritt)</Label>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					class="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
					onclick={() => (assistPlayerId = undefined)}
				>
					Fjern assist
				</Button>
			</div>
			<div class="grid grid-cols-[1fr_1fr] gap-4">
				{@render teamRadioColumn(
					match.home_team.players,
					`assistPlayerId-home`,
					'assistPlayerId',
					assistPlayerId,
					(v) => (assistPlayerId = v),
					'Hjemmelag',
					(v) => v === goalPlayerId
				)}
				{@render teamRadioColumn(
					match.away_team.players,
					`assistPlayerId-away`,
					'assistPlayerId',
					assistPlayerId,
					(v) => (assistPlayerId = v),
					'Bortelag',
					(v) => v === goalPlayerId
				)}
			</div>
			<Dialog.Footer class="mt-4">
				<Button type="button" variant="outline" onclick={() => (goalDialogOpen = false)}>Avbryt</Button>
				<Button type="submit" disabled={!goalPlayerId}>Opprett Mål</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={clutchDialogOpen} onOpenChange={(open) => !open && resetClutchForm()}>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Legg til nytt C-moment</Dialog.Title>
		</Dialog.Header>
		<form
			action="?/createClutch"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						clutchDialogOpen = false;
						toasts.add('C-moment opprettet!', 'success');
						resetClutchForm();
					} else {
						toasts.add('Noe gikk galt ved opprettelse av c-moment.', 'error');
					}
					await update();
				};
			}}
		>
			<div class="grid grid-cols-[1fr_1fr] gap-4 py-4">
				<input type="hidden" name="matchId" value={match.id} />
				{@render teamRadioColumn(
					match.home_team.players,
					'home',
					'clutchPlayerId',
					clutchPlayerId,
					(v) => (clutchPlayerId = v),
					'Hjemmelag'
				)}
				{@render teamRadioColumn(
					match.away_team.players,
					'away',
					'clutchPlayerId',
					clutchPlayerId,
					(v) => (clutchPlayerId = v),
					'Bortelag'
				)}
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (clutchDialogOpen = false)}>Avbryt</Button>
				<Button type="submit" disabled={!clutchPlayerId}>Opprett C-moment</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
