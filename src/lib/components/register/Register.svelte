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
	let clientError = '';

	const handleRegistration = async () => {
		try {
			serverError = '';
			clientError = '';
			loading = true;

			if (!form.username) {
				clientError = 'Vennligst oppgi brukernavn';
				return;
			}

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

<div class="container mx-auto max-w-screen-lg flex flex-col items-center justify-center space-y-4 sm:space-y-8 lg:space-y-10">
	<LargeLogo />

	<form class="w-1/2 lg:w-1/3" on:submit|preventDefault={handleRegistration}>
		<div class="mb-6">
			<label for="username" class="block mb-1"><h3>Brukernavn</h3></label>
			<input type="text" id="username" class="block w-full p-2.5 rounded-lg text-primary-color" placeholder="Jørgen Kjekk Alfredsen" bind:value={form.username} required>
		</div>
        <div class="mb-6">
			<label for="email" class="block mb-1"><h3>Epost</h3></label>
			<input type="email" id="email" class="block w-full p-2.5 rounded-lg text-primary-color" placeholder="næbb@næbbesen.no" bind:value={form.email} required>
		</div> 
        <div class="mb-6">
			<label for="password" class="block mb-1"><h3>Passord</h3></label>
			<input type="password" id="password" class="block w-full p-2.5 rounded-lg text-primary-color" placeholder="" bind:value={form.password} required>
		</div> 
		<div class="mb-6">
			<input
				type="submit"
				class="button rounded-lg w-full p-2.5 text-center bg-primary-color-light hover:bg-primary-color hover:cursor-pointer"
				value={loading ? 'Laster' : 'Registrer'}
				disabled={loading}
			/>
		</div>
		{#if serverError || clientError}
			<p class="text-rose-600">Noe gikk galt: {serverError || clientError}</p>
		{/if}
	</form>
</div>