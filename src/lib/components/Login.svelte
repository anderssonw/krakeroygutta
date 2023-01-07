<script lang="ts">
	import { goto } from '$app/navigation';
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

<form class="row flex-center flex" on:submit|preventDefault={handleLogin}>
	<div class="col-6 form-widget">
		<p class="description">Logg Inn Her:</p>
		<div>
			<input class="inputField" type="email" placeholder="Epost" bind:value={email} />
			<input class="inputField" type="password" placeholder="Passord" bind:value={password} />
		</div>
		<div>
			<input
				type="submit"
				class="button block"
				value={loading ? 'Loading' : 'Logg inn'}
				disabled={loading}
			/>
		</div>
	</div>
</form>
