<script lang="ts">
	import type { FullPlayer } from '$lib/types/newTypes';

	import { afterUpdate } from 'svelte';

	export let player: FullPlayer;
	export let isCaptain: boolean;

	let cardType: string = 'bronze';

	afterUpdate(() => {
		if (player.id) {
			if (player.price > 4000 && player.price < 5000) {
				cardType = 'silver';
			}
			if (player.price >= 5000) {
				cardType = 'gold';
			}
		}
	});

	let captainShadow = 'animate-captainDropShadowPulse';
</script>

{#if player}
	<div class={isCaptain ? captainShadow : ''}>
		<img src="/cards/{cardType}.png" alt="card" />

		<div class="w-16 absolute top-[19%] right-[10%]">
			<img src="/profile/placeholder.png" alt="head" />
			<div class="absolute top-[86%] bg-gradient-to-t from-slate-950/25 to-transparent w-[100%] h-2" />
		</div>
		<div class="w-full absolute top-[5%] right-[25%]">
			<p class="text-center text-primary-color text-3xl">50</p>
		</div>

		<div class="w-full absolute top-[51%]">
			<p class="text-center text-primary-color text-xl">{player.name.split(' ')[1]}</p>
		</div>

		<div class="w-full absolute top-[67%] right-[23%]">
			<p class="text-center text-primary-color text-sm">{player.attack} ATK</p>
		</div>
		<div class="w-full absolute top-[77%] right-[23%]">
			<p class="text-center text-primary-color text-sm">{player.defence} DEF</p>
		</div>
		<div class="w-full absolute top-[67%] left-[23%]">
			<p class="text-center text-primary-color text-sm">{player.physical} PHY</p>
		</div>
		<div class="w-full absolute top-[77%] left-[26%]">
			<p class="text-center text-primary-color text-sm">{player.morale} MOR</p>
		</div>
	</div>
{/if}
