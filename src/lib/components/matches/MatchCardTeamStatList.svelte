<script lang="ts">
	import type { PlayerWithStatCount } from '$lib/types/newTypes';

	export let playerStats: PlayerWithStatCount[];
	export let title: string;
	export let noValDesc: string;

	const anyPlayerHasCount = (playerStats: PlayerWithStatCount[]) => {
		return playerStats.find((player) => player.count > 0) ? true : false;
	};

	const getShortName = (name: string) => {
		let splitNames = name.split(' ');

		return `${splitNames[0]} ${splitNames[splitNames.length - 1][0]}.`;
	};
</script>

<div>
	<p class="font-bold mb-2">{title}</p>
	{#if anyPlayerHasCount(playerStats)}
		{#each playerStats.sort((a, b) => b.count - a.count) as player, index}
			{#if player.count > 0}
				<div class={`flex flex-row justify-between ${index % 2 == 0 ? 'bg-zinc-100' : 'bg-zinc-200'} font-light`}>
					<p class="px-2">{getShortName(player.name)}</p>
					<p class="px-2">{player.count}</p>
				</div>
			{/if}
		{/each}
	{:else}
		<div class="flex flex-row font-light">
			{noValDesc}
		</div>
	{/if}
</div>
