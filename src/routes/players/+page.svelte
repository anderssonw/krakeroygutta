<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import Players from '$lib/components/players/Players.svelte';
	import type { FullPlayer } from '$lib/types/newTypes';

	// Get server data
	export let data: PageData;
	$: ({ session, players, playersSeasons } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});

	const mergePlayers = (): FullPlayer[] => {
		let fullPlayers = data.players?.map((player) => {
			let playerSeason = data.playersSeasons?.find((playerSeason) => playerSeason.player_id == player.id);
			if (playerSeason) {
				return {
					id: player.id,
					name: player.name,
					image: player.image ?? 'placeholder.png',
					attack: playerSeason.attack,
					defence: playerSeason.defence,
					morale: playerSeason.morale,
					physical: playerSeason.physical,
					price: playerSeason.price
				};
			}
			return {
				id: -1,
				name: 'fucko boingo',
				image: 'peepoo',
				attack: 0,
				defence: 0,
				morale: 0,
				physical: 0,
				price: 0
			};
		});

		if (fullPlayers) {
			return fullPlayers;
		}

		return [];
	};
</script>

{#if session && players && playersSeasons}
	<Players players={mergePlayers()} />
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
