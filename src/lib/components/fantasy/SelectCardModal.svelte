<script lang="ts">
	import { CARD_SIZE, calculatePlayerStatAverage } from '$lib/shared/playerCardFunctions';
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import Card from '../cards/Card.svelte';

	export let players: FullPlayer[];
	export let fantasyForm: FantasyForm;

	const calculatePlayersToShow = (allPlayers: FullPlayer[], playersInForm: (FullPlayer | null)[]) => {
		let playersInFormIds = playersInForm.map((player) => player?.player_id || -1);
		return allPlayers
			.filter((player) => {
				return !playersInFormIds.includes(player.player_id);
			})
			.sort((a, b) => calculatePlayerStatAverage(b) - calculatePlayerStatAverage(a));
	};

	function buyPlayer(player: FullPlayer) {
		fantasyForm.players[fantasyForm.selectedCardPosition] = player;
		fantasyForm.selectedCardPosition = -1;
	}

	$: playersNotInForm = calculatePlayersToShow(players, fantasyForm.players);
	$: hasCardSelected = fantasyForm.selectedCardPosition >= 0 ? true : false;
</script>

{#if hasCardSelected}
	<div class="fixed bottom-0 top-0 right-0 left-0 z-50 bg-black/90">
		<div class="fixed top-20 right-20 hover:cursor-pointer">
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<h3
				on:mouseup={() => {
					fantasyForm.selectedCardPosition = -1;
				}}
			>
				X
			</h3>
		</div>
		<div class="max-w-screen-laptop h-3/4 px-4 tablet:px-8 rounded-lg fixed m-auto inset-x-0 inset-y-0 overflow-y-scroll">
			<div class="w-full flex flex-row flex-wrap gap-4 tablet:gap-8 justify-around tablet:justify-center">
				{#each playersNotInForm as player}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="clickable-card hidden tablet:block" on:mouseup={() => buyPlayer(player)}>
						<Card {player} card_size={CARD_SIZE.MEDIUM} />
					</div>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="clickable-card block tablet:hidden" on:mouseup={() => buyPlayer(player)}>
						<Card {player} card_size={CARD_SIZE.SMALL} />
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
