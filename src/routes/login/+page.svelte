<script lang="ts">
	import { goto } from '$app/navigation';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ session, supabase, user } = data);

	let email: string;
	let password: string;

	let loading = false;
	let serverError = '';

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				serverError = error.message;
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="structure">
	<LargeLogo />

	<h2>Innlogging</h2>

	<form class="w-1/2 laptop:w-1/3" on:submit|preventDefault={handleLogin}>
		<div class="mb-6">
			<label for="email" class="block mb-1"><h4>Epost</h4></label>
			<input type="email" id="email" class="input w-full" placeholder="næbb@næbbesen.no" bind:value={email} />
		</div>
		<div class="mb-6">
			<label for="password" class="block mb-1"><h4>Passord</h4></label>
			<input type="password" id="password" class="input w-full" placeholder="" bind:value={password} />
		</div>
		<div class="mb-6 flex justify-center">
			<input type="submit" class="btn" value={loading ? 'Laster' : 'Logg deg inn'} disabled={loading} />
		</div>
		{#if serverError}
			<p class="text-rose-600">Noe gikk galt: {serverError}</p>
		{/if}
	</form>
</div>
