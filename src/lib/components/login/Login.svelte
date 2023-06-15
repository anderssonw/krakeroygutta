<script lang="ts">
	import { goto } from '$app/navigation';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
	import { supabase } from '$lib/supabase';

	let loading = false;
	let email: string;
	let password: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="container mx-auto max-w-screen-lg flex flex-col items-center justify-center space-y-4 sm:space-y-8 lg:space-y-10">
	<LargeLogo />

	<form class="w-1/2 lg:w-1/3" on:submit|preventDefault={handleLogin}>
        <div class="mb-6">
			<label for="email" class="block mb-1"><h3>Epost</h3></label>
			<input type="email" id="email" class="block w-full p-2.5 rounded-lg text-primary-color" placeholder="næbb@næbbesen.no" bind:value={email}>
		</div> 
        <div class="mb-6">
			<label for="password" class="block mb-1"><h3>Passord</h3></label>
			<input type="password" id="password" class="block w-full p-2.5 rounded-lg text-primary-color" placeholder="" bind:value={password}>
		</div> 
        <div class="mb-6">
            <input 
                type="submit" 
                class="button rounded-lg w-full p-2.5 text-center bg-primary-color-light hover:bg-primary-color hover:cursor-pointer" 
                value={loading ? 'Loading' : 'Logg inn'}
                disabled={loading} />
        </div>
	</form>
</div>