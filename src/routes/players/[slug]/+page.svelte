<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import Player from '$lib/components/players/Player.svelte';
	import { page } from '$app/stores';

	// Get server data
	export let data: PageData;
	$: ({ session, player } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});
</script>

{#if session}
	{#if player}
		<Player {player} />
	{:else}
		<p>Fant eeente spellern med id {$page.params.slug}</p>
	{/if}
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
