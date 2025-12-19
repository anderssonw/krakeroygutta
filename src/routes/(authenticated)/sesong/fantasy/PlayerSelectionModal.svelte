<script lang="ts">
	import { onMount } from 'svelte';
	import type { SeasonAndTeamPlayer } from '$lib/types/player';
	import PlayerCard from '$lib/components/PlayerCards/PlayerCard.svelte';
	import { getCurrentBreakpoint } from '$lib/breakpoints';
	import CloseIcon from '~icons/mdi/close';
	import { getPlayerAverage } from '$lib/player';

	type Props = {
		players: SeasonAndTeamPlayer[];
		excludePlayerIds?: number[];
		onSelect: (player: SeasonAndTeamPlayer) => void;
		onClose: () => void;
	};

	let { players, excludePlayerIds = [], onSelect, onClose }: Props = $props();

	let searchQuery = $state('');
	let modalElement: HTMLDivElement | undefined = $state();
	let searchInput: HTMLInputElement | undefined = $state();
	const breakpoint = getCurrentBreakpoint();

	const availablePlayers = $derived(
		players
			.filter((p) => !excludePlayerIds.includes(p.id))
			.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => getPlayerAverage(b) - getPlayerAverage(a))
	);

	function handleSelect(player: SeasonAndTeamPlayer) {
		onSelect(player);
		onClose();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === modalElement) {
			onClose();
		}
	}

	function handleEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleEscape);

		// Prevent body scroll
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		// Focus the search input
		if (searchInput) {
			searchInput.focus();
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			// Restore body scroll
			document.body.style.overflow = originalOverflow;
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={modalElement}
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
	onclick={handleBackdropClick}
	aria-modal="true"
>
	<div class="relative flex max-h-[90vh] w-full max-w-6xl flex-col rounded-lg bg-background shadow-xl">
		<div class="shrink-0 border-b border-border p-6">
			<div class="flex items-center justify-between">
				<h2 id="modal-title" class="text-2xl font-bold">Velg Spiller</h2>
				<button
					onclick={onClose}
					class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					aria-label="Close modal"
				>
					<CloseIcon class="h-6 w-6" />
				</button>
			</div>
			<input
				bind:this={searchInput}
				type="text"
				placeholder="Søk etter spiller..."
				bind:value={searchQuery}
				class="mt-4 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
			/>
		</div>

		<div class="flex-1 overflow-y-auto p-6">
			{#if availablePlayers.length === 0}
				<p class="text-center text-muted-foreground">Ingen spillere funnet</p>
			{:else}
				<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-6">
					{#each availablePlayers as player}
						<button
							onclick={() => handleSelect(player)}
							class="flex justify-center transition-transform hover:scale-105 hover:cursor-pointer"
						>
							<PlayerCard {player} size={breakpoint === 'lg' ? 'md' : breakpoint} />
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
