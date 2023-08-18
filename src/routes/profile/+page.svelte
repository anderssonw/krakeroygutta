<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

	// Get server data
	export let data: PageData;
	$: ({ session, supabase } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});

	const logOut = async () => {
		try {
			await supabase.auth.signOut();
			goto('/login');
		} catch (error) {
			console.log(error);
		}
	};
</script>

{#if session}
	<button on:click={logOut}>Logg ut</button>
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
