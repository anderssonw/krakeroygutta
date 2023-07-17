<script lang="ts">
	import { goto } from '$app/navigation';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
	import { supabase } from '$lib/supabase';

	interface userFormProps {
		email: string;
		password: string;
		username: string;
	}

	let form: userFormProps = {
		email: '',
		password: '',
		username: ''
	};

	let loading = false;
	let serverError = '';

	const handleRegistration = async () => {
		try {
			serverError = '';
			loading = true;

			const { error } = await supabase.auth.signUp({
				email: form.email,
				password: form.password,
				options: { data: { username: form.username } }
			});
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

	<h2> Registrering </h2>

	<form class="w-1/2 laptop:w-1/3" on:submit|preventDefault={handleRegistration}>
		<div class="mb-6">
			<label for="username" class="block mb-1"><h4>Brukernavn</h4></label>
			<input type="text" id="username" class="input w-full" placeholder="Jørgen Kjekk Alfredsen" bind:value={form.username} required>
		</div>
        <div class="mb-6">
			<label for="email" class="block mb-1"><h4>Epost</h4></label>
			<input type="email" id="email" class="input w-full" placeholder="næbb@næbbesen.no" bind:value={form.email} required>
		</div> 
        <div class="mb-6">
			<label for="password" class="block mb-1"><h4>Passord</h4></label>
			<input type="password" id="password" class="input w-full" placeholder="" bind:value={form.password} required>
		</div> 
		<div class="mb-6 flex justify-center">
			<input
				type="submit"
				class="btn"
				value={loading ? 'Laster' : 'Registrer bruker'}
				disabled={loading}
			/>
		</div>
		{#if serverError}
			<p class="text-rose-600">Noe gikk galt: {serverError}</p>
		{/if}
	</form>
</div>