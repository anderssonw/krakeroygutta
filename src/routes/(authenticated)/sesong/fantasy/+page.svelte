<script lang="ts">
	import type { PageProps } from './$types';
	import FantasyPlayerCard from './FantasyPlayerCard.svelte';
	import EmptyPlayerCard from '$lib/components/PlayerCards/EmptyPlayerCard.svelte';
	import PlayerSelectionModal from './PlayerSelectionModal.svelte';
	import FantasyTeamStats from './FantasyTeamStats.svelte';
	import type { SeasonPlayer } from '$lib/types/player';
	import { TEAM_SIZE, validateFantasyTeam } from './validation';
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { toasts } from '$lib/stores/toast';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';

	let { data, form }: PageProps = $props();

	let isSubmitting = $state(false);

	let fantasyForm: FantasyForm = $state({
		id: null,
		name: '',
		playerIds: [],
		captainPlayerId: null
	});

	// Only initialize form once when fantasyTeam is available
	let hasInitialized = false;
	$effect(() => {
		const team = data.fantasyTeam;
		if (!team || hasInitialized) return;

		fantasyForm.id = team.id;
		fantasyForm.name = team.name;
		fantasyForm.playerIds = team.playersIds;
		fantasyForm.captainPlayerId = team.captainPlayerId;
		hasInitialized = true;
	});

	$effect(() => {
		if (form?.success) {
			toasts.add('Laget ditt ble lagret!', 'success');
		} else if (form?.errors) {
			toasts.add(form.errors, 'error');
		}
	});

	const budget = $derived(data.season ? data.season.starting_currency : 0);

	const isDeadlinePassed = $derived(data.season ? new Date() > data.season.deadline_time : false);

	const teamSlots = $derived(Array.from({ length: TEAM_SIZE }, (_, i) => fantasyForm.playerIds[i] ?? null));

	let showPlayerModal = $state(false);

	function handlePlayerSelect(player: SeasonPlayer) {
		if (fantasyForm.playerIds.length < TEAM_SIZE) {
			fantasyForm.playerIds = [...fantasyForm.playerIds, player.id];
		}
	}

	function handleDeletePlayer(playerId: number) {
		fantasyForm.playerIds = fantasyForm.playerIds.filter((id) => id !== playerId);
		if (fantasyForm.captainPlayerId === playerId) {
			fantasyForm.captainPlayerId = null;
		}
	}

	function handleToggleCaptain(playerId: number) {
		fantasyForm.captainPlayerId = fantasyForm.captainPlayerId === playerId ? null : playerId;
	}
</script>

<div class="container mx-auto mt-8 text-center">
	<h1 class="mb-2 text-4xl font-bold">Ditt Fantasylag</h1>
	{#if data.season}
		<p class="text-muted-foreground">
			{data.season.name}
		</p>
		<p class="text-sm text-muted-foreground">
			Frist: {data.season.deadline_time.toLocaleString('nb-NO', {
				dateStyle: 'medium',
				timeStyle: 'short'
			})}
		</p>

		{#if isDeadlinePassed}
			<p class="mt-2 px-4 text-sm font-semibold text-destructive">Fristen har gått ut. Du kan ikke lenger gjøre endringer på laget ditt.</p>
		{/if}

		{#await data.players}
			<div class="flex items-center justify-center py-8">
				<p class="text-lg text-muted-foreground">Henter fantasylag...</p>
			</div>
		{:then players}
			{#if showPlayerModal}
				<PlayerSelectionModal
					{players}
					excludePlayerIds={fantasyForm.playerIds}
					onSelect={handlePlayerSelect}
					onClose={() => (showPlayerModal = false)}
				/>
			{/if}

			{@const selectedPlayers = players.filter((p) => fantasyForm.playerIds.includes(p.id))}
			{@const totalCost = selectedPlayers.reduce((sum, p) => sum + (p.price ?? 0), 0)}
			{@const remainingCash = budget - totalCost}
			{@const validationError = validateFantasyTeam({
				name: fantasyForm.name,
				playerIds: fantasyForm.playerIds,
				captainPlayerId: fantasyForm.captainPlayerId,
				remainingCash
			})}

			<div class="px-4">
				<FantasyTeamStats
					{players}
					selectedPlayerIds={fantasyForm.playerIds}
					captainPlayerId={fantasyForm.captainPlayerId}
					{budget}
					teamName={fantasyForm.name}
					onTeamNameChange={(name) => (fantasyForm.name = name)}
					disabled={data.season === null || isDeadlinePassed}
				/>
			</div>

			<form
				method="POST"
				class="mb-8 text-center"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						try {
							await update();
						} catch (error) {
							console.error('Form submission error:', error);
							toasts.add('En feil oppstod under lagring. Prøv igjen.', 'error');
						} finally {
							isSubmitting = false;
						}
					};
				}}
			>
				<input type="hidden" name="teamId" value={fantasyForm.id} />
				<input type="hidden" name="teamName" value={fantasyForm.name} />
				{#each fantasyForm.playerIds as playerId}
					<input type="hidden" name="playerIds" value={playerId} />
				{/each}
				<input type="hidden" name="captainId" value={fantasyForm.captainPlayerId ?? ''} />

				<Button type="submit" variant="outline" size="lg" disabled={validationError != null || isSubmitting || isDeadlinePassed}>
					{#if isSubmitting}
						<span class="flex justify-center">
							<Spinner size="md" />
						</span>
					{:else}
						Lagre
					{/if}
				</Button>
			</form>

			{#if validationError}
				<p class="mt-2 text-sm text-muted-foreground">{validationError.message}</p>
			{/if}

			{#snippet playerSlot(playerId: number | null)}
				{#if playerId !== null}
					{@const player = players.find((p) => p.id === playerId)}
					{#if player}
						<FantasyPlayerCard
							{player}
							isCaptain={fantasyForm.captainPlayerId === player.id}
							onDelete={() => handleDeletePlayer(player.id)}
							onToggleCaptain={() => handleToggleCaptain(player.id)}
							disabled={isDeadlinePassed}
						/>
					{/if}
				{:else}
					<EmptyPlayerCard onclick={() => (showPlayerModal = true)} disabled={isDeadlinePassed} />
				{/if}
			{/snippet}

			<div class="fantasy-field small grid grid-cols-2 grid-rows-2 place-items-center gap-x-4 gap-y-16 py-8 md:hidden">
				{#each teamSlots as playerId}
					{@render playerSlot(playerId)}
				{/each}
			</div>
			<div class="fantasy-field large relative mb-8 hidden h-192 md:block">
				{#each teamSlots as playerId, index}
					<div
						class={cn(
							'absolute',
							index === 0 && 'top-12 left-1/2 -translate-x-1/2',
							index === 1 && 'top-1/2 left-16 -translate-y-1/3',
							index === 2 && 'top-1/2 right-16 -translate-y-1/3',
							index === 3 && 'bottom-4 left-1/2 -translate-x-1/2'
						)}
					>
						{@render playerSlot(playerId)}
					</div>
				{/each}
			</div>
		{:catch error}
			<p>Feil ved henting av fantasylag: {error.message}</p>
		{/await}
	{:else}
		<div class="mx-auto max-w-md rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-yellow-800">
			<p class="font-semibold">Ingen aktiv sesong</p>
			<p class="mt-1 text-sm">Det er ingen aktiv sesong for øyeblikket. Kom tilbake senere!</p>
		</div>
	{/if}
</div>
