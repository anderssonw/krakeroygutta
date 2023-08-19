<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import Player from '$lib/components/players/Player.svelte';

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
	<Player {player} />
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
