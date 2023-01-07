<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	interface userFormProps {
		email: string;
		password: string;
		passwordRepeat: string;
		username: string;
	}

	let form: userFormProps = {
		email: '',
		password: '',
		passwordRepeat: '',
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
			if (form.password != form.passwordRepeat) {
				clientError = 'Passordene er ikke like';
				return;
			}

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

<form class="registrationForm" on:submit|preventDefault={handleRegistration}>
	<p class="description">Registrer bruker her</p>

	<label for="email">E-post</label>
	<input name="email" type="email" placeholder="Epost" bind:value={form.email} />
	<label for="username">Brukernavn</label>
	<input name="username" type="text" placeholder="Brukernavn" bind:value={form.username} />
	<label for="password">Passord</label>
	<input name="password" type="password" placeholder="Passord" bind:value={form.password} />
	<label for="passwordRepeat">Gjenta Passord</label>
	<input
		name="passwordRepeat"
		type="password"
		placeholder="Passord"
		bind:value={form.passwordRepeat}
	/>
	<input
		type="submit"
		class="button block"
		value={loading ? 'Laster' : 'Registrer'}
		disabled={loading}
	/>
	{#if serverError || clientError}
		<p class="error">Noe gikk galt: {serverError || clientError}</p>
	{/if}
</form>

<style>
	.error {
		color: red;
	}
	.registrationForm {
		display: grid;
		gap: 12px;
	}
</style>
