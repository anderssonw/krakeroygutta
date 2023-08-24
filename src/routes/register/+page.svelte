<script lang="ts">
	import LargeLogo from '$lib/shared/largeLogo.svelte';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="structure">
	<LargeLogo />

	<h2>Registrering</h2>

	<form class="w-1/2 laptop:w-1/3" method="POST">
		<div class="mb-6">
			<label for="email" class="block mb-1"><h4>Epost</h4></label>
			<input type="email" name="email" class="input w-full" placeholder="næbb@næbbesen.no" required />
		</div>
		<div class="mb-6">
			<label for="password" class="block mb-1"><h4>Passord</h4></label>
			<input type="password" name="password" class="input w-full" placeholder="" required />
		</div>
		<div class="mb-6 flex justify-center">
			<input type="submit" class="btn" value={'Registrer'} />
		</div>
	</form>

	{#if form?.supabaseErrorMessage}
		<p>{form.supabaseErrorMessage}</p>
	{/if}
</div>
