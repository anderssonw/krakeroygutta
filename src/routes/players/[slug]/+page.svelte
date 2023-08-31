<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';

	// Get server data
	export let data: PageData;
	$: ({ player } = data);
</script>

{#if player}
	<Player {player} />
{:else}
	<p>Fant eente spellern med id {$page.params.slug}</p>
{/if}
