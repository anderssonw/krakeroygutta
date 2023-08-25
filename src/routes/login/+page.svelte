<script lang="ts">
	import { goto } from '$app/navigation';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ supabase } = data);

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

	<h3>Innlogging</h3>

	<form class="form" on:submit|preventDefault={handleLogin}>
		<div class="form-structure">
			<div class="w-full">
				<label for="email" class="block mb-1"><h5>Epost</h5></label>
				<input type="email" id="email" class="input w-full" placeholder="næbb@næbbesen.no" bind:value={email} />
			</div>
			<div class="w-full">
				<label for="password" class="block mb-1"><h5>Passord</h5></label>
				<input type="password" id="password" class="input w-full" placeholder="" bind:value={password} />
			</div>
			<div>
				<input type="submit" class="btn" value={loading ? 'Laster' : 'Logg deg inn'} disabled={loading} />
			</div>
		</div>

		{#if serverError}
			<p class="text-rose-600">Noe gikk galt: {serverError}</p>
		{/if}
	</form>
</div>
