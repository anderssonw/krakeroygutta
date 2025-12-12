<script lang="ts">
	import type { PageProps } from './$types';
	import FantasyPlayerCard from './FantasyPlayerCard.svelte';
	import EmptyPlayerCard from '$lib/components/PlayerCards/EmptyPlayerCard.svelte';
	import PlayerSelectionModal from './PlayerSelectionModal.svelte';
	import FantasyTeamStats from './FantasyTeamStats.svelte';
	import { getCurrentBreakpoint } from '$lib/breakpoints';
	import type { SeasonAndTeamPlayer } from '$lib/types/player';
	import { TEAM_SIZE, validateFantasyTeam } from './validation';
	import { getPlayerAverage } from '$lib/player';
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import { toasts } from '$lib/stores/toast';

	let { data, form }: PageProps = $props();

	let isSubmitting = $state(false);

	const breakpoint = getCurrentBreakpoint();

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

	const teamSlots = $derived(Array.from({ length: TEAM_SIZE }, (_, i) => fantasyForm.playerIds[i] ?? null));

	let showPlayerModal = $state(false);

	function handlePlayerSelect(player: SeasonAndTeamPlayer) {
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

<div class="container mx-auto mt-8">
	<div class="mb-8 text-center">
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

				<FantasyTeamStats
					{players}
					selectedPlayerIds={fantasyForm.playerIds}
					captainPlayerId={fantasyForm.captainPlayerId}
					{budget}
					teamName={fantasyForm.name}
					onTeamNameChange={(name) => (fantasyForm.name = name)}
					disabled={data.season === null}
				/>

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

					<button
						type="submit"
						class="w-32 rounded-lg bg-green-600 px-4 py-2 hover:cursor-pointer hover:bg-green-700 disabled:cursor-not-allowed"
						disabled={validationError != null || isSubmitting}
					>
						{#if isSubmitting}
							<span class="flex justify-center">
								<Spinner size="md" />
							</span>
						{:else}
							Lagre
						{/if}
					</button>
				</form>

				{#if validationError}
					<p class="mt-2 text-sm text-muted-foreground">{validationError.message}</p>
				{/if}

				<div class="fantasy-field small grid grid-cols-2 grid-rows-2 place-items-center gap-x-4 gap-y-16 py-8">
					{#each teamSlots as playerId}
						{#if playerId !== null}
							{@const player = players.find((p) => p.id === playerId)}
							{#if player}
								<FantasyPlayerCard
									{player}
									isCaptain={fantasyForm.captainPlayerId === player.id}
									onDelete={() => handleDeletePlayer(player.id)}
									onToggleCaptain={() => handleToggleCaptain(player.id)}
								/>
							{/if}
						{:else}
							<EmptyPlayerCard onclick={() => (showPlayerModal = true)} size={breakpoint} />
						{/if}
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
</div>
