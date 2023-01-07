<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';

	const logOut = async () => {
		try {
			await supabase.auth.signOut();
			goto('/login');
		} catch (error) {
			console.log(error);
		}
	};
</script>

<main class="content">
	{#if $page.data.session}
		{$page.data.session.user.email}
		<button on:click={logOut}>Logg ut</button>
	{:else}
		<p>ur not logged in dummy</p>
	{/if}
</main>

<style>
</style>
