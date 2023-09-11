<script lang="ts">
	import { getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer } from '$lib/types/newTypes';
	import IconStats from '../common/IconStats.svelte';
	import placeholderImg from '$lib/assets/cards/Placeholder.png';

	export let player: FullPlayer | null;

    $: cardBackType = getPlayerCardType(player, false);
</script>

<div class="structure">
	<div class="relative w-full h-64 tablet:h-80 laptop:h-96 {cardBackType}">
		<div class="w-52 tablet:w-64 laptop:w-80 absolute bottom-0 left-1/2 -translate-x-1/2">
			<img src={placeholderImg} alt="head" />
		</div>
	</div>

	
	<div class="w-full flex flex-col items-center 
		space-y-2 tablet:space-y-4 laptop:space-y-6 
		p-4 tablet:p-8 laptop:p-12 
		border-y-4 laptop:border-4 border-secondary-light laptop:rounded-lg">

		<h1>{player?.name}</h1>
		<h3>Pris: {player?.price}</h3>

		<div class="w-2/3 flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6">
			<div class="w-full flex flex-row border-b-2">
				<h3 class="grow">Angrep</h3>
				<h3 class="grow text-end">{player?.attack}</h3>
			</div>
			<div class="w-full flex flex-row border-b-2">
				<h3 class="grow">Forsvar</h3>
				<h3 class="grow text-end">{player?.defence}</h3>
			</div>
			<div class="w-full flex flex-row border-b-2">
				<h3 class="grow">Fysikk</h3>
				<h3 class="grow text-end">{player?.physical}</h3>
			</div>
			<div class="w-full flex flex-row border-b-2">
				<h3 class="grow">Moral</h3>
				<h3 class="grow text-end">{player?.morale}</h3>
			</div>
			<h3>Total: 50</h3>
		</div>
	</div>

	<div class="w-full flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6 pb-12 border-b-4 border-secondary-light">
		<h3>Summer 2023</h3>
		<div class="grid grid-cols-3 w-full tablet:w-2/3 pb-2 border-b-2">
			<IconStats amount={1} large={true} icon={'goal'} />
			<IconStats amount={5} large={true} icon={'assist'} />
			<IconStats amount={10} large={true} icon={'clutch'} />
		</div>
		<div class="grid grid-cols-2 w-full tablet:w-2/3">
			<IconStats amount={1} large={true} icon={'win'} />
			<IconStats amount={5} large={true} icon={'cleansheet'} />
		</div>
	</div>

	<div class="w-full flex flex-col items-center space-y-2 tablet:space-y-4 laptop:space-y-6 pb-12 border-b-4 border-secondary-light">
		<h3>Summer 2023</h3>
		<div class="grid grid-cols-3 w-full tablet:w-2/3 pb-2 border-b-2">
			<IconStats amount={1} large={true} icon={'goal'} />
			<IconStats amount={5} large={true} icon={'assist'} />
			<IconStats amount={10} large={true} icon={'clutch'} />
		</div>
		<div class="grid grid-cols-2 w-full tablet:w-2/3">
			<IconStats amount={1} large={true} icon={'win'} />
			<IconStats amount={5} large={true} icon={'cleansheet'} />
		</div>
	</div>
</div>
