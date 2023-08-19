<script lang="ts">
	import { goto } from '$app/navigation';

	import type { FullPlayer } from '$lib/types/newTypes';

	import { onMount } from 'svelte';
	export let player: FullPlayer;

	let card_type: string = 'bronze';

	onMount(() => {
		if (player.price > 4000 && player.price < 5000) {
			card_type = 'silver';
		}
		if (player.price >= 5000) {
			card_type = 'gold';
		}
	});

	$: playerStatAverage = calculatePlayerStatAverage();

	const calculatePlayerStatAverage = () => {
		return Math.ceil((player.attack + player.defence + player.morale + player.physical) / 4);
	};
</script>

{#if player}
	<div class="large-card group" on:mouseup={() => goto(`/players/${player.id}`)}>
		<img src="/cards/{card_type}.png" alt="gold" class="group-hover:drop-shadow-{card_type}" />
		<div class="w-28 absolute top-[18%] right-[8%]">
			<img src="/profile/placeholder.png" alt="head" />
			<div class="absolute top-[94%] bg-gradient-to-t from-slate-950/25 to-transparent w-[100%] h-2" />
		</div>

		<div class="w-full absolute top-[8%] right-[25%]">
			<p class="text-center text-primary-color text-5xl">{playerStatAverage}</p>
		</div>

		<div class="w-full absolute top-[53%]">
			<p class="text-center text-primary-color text-3xl">{player.name.split(' ')[1]}</p>
		</div>

		<div class="w-full absolute top-[69%] right-[20%]">
			<p class="text-center text-primary-color text-xl">{player.attack} ATK</p>
		</div>
		<div class="w-full absolute top-[79%] right-[20%]">
			<p class="text-center text-primary-color text-xl">{player.defence} DEF</p>
		</div>
		<div class="w-full absolute top-[69%] left-[20%]">
			<p class="text-center text-primary-color text-xl">{player.physical} PHY</p>
		</div>
		<div class="w-full absolute top-[79%] left-[22%]">
			<p class="text-center text-primary-color text-xl">{player.morale} MOR</p>
		</div>
	</div>
{:else}
	<p>No player :(</p>
{/if}
