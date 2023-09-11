<script lang="ts">
	import type { FullPlayer } from '$lib/types/newTypes';
	import goldCard from '$lib/assets/cards/gold.png';
	import silverCard from '$lib/assets/cards/silver.png';
	import bronzeCard from '$lib/assets/cards/gold.png';
	import { getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import placeholderImg from '$lib/assets/cards/Placeholder.png';

	export let player: FullPlayer;
	export let isCaptain: boolean;

	$: cardType = getPlayerCardType(player, true);

	let captainShadow = 'animate-captainDropShadowPulse';

	function getImage(card: string) {
		if (cardType == 'bronze-card') return bronzeCard;
		if (cardType == 'silver-card') return silverCard;
		if (cardType == 'gold-card') return goldCard;
		return '';
	}
</script>

{#if player}
	<div class={isCaptain ? captainShadow : ''}>
		<img src={getImage(cardType)} alt="card" />

		<div class="w-16 absolute top-[19%] right-[10%]">
			<img src={placeholderImg} alt="head" />
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
