<script lang="ts">
	import type { PageData } from './$types';
	import Players from '$lib/components/players/Players.svelte';

	// Get server data
	export let data: PageData;
	$: ({ mappedPlayers } = data);
</script>

{#if mappedPlayers}
	<Players players={mappedPlayers} />
{/if}
