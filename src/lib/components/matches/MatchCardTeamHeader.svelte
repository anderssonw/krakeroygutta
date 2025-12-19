<script lang="ts">
	import type { MatchStatsTeam } from '$lib/types/newTypes';
	import TeamKit from '../common/TeamKit.svelte';

	export let mirror: boolean = false;
	export let team: MatchStatsTeam;
</script>

<div class="flex flex-row">
	<div class={`flex flex-col p-2 justify-center items-center w-16 ${mirror ? 'order-2' : 'order-1'}`}>
		<TeamKit color={team.color} />
	</div>
	<div class={`flex flex-col justify-center ${mirror ? 'order-1' : 'order-2'}`}>
		<p class="font-semibold">{team.name}</p>
		<p class="text-xs font-light max-w-[30ch]">{team.players.map((player) => player.name).join(', ')}</p>
	</div>
</div>
