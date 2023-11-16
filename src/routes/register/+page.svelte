<script lang="ts">
	import { enhance } from '$app/forms';
	import LargeLogo from '$lib/components/common/LargeLogo.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="structure">
	<LargeLogo />

	<h3>Registrering</h3>

	<form class="form" method="POST" use:enhance>
		<div class="form-structure">
			<div class="w-full">
				<label for="nickname" class="block mb-1"><h5>Kallenavn</h5></label>
				<input type="nickname" name="nickname" class="input" placeholder="Magnus VG" maxlength={20} required />
			</div>
			<div class="w-full">
				<label for="email" class="block mb-1"><h5>Epost</h5></label>
				<input type="email" name="email" class="input" placeholder="næbb@næbbesen.no" required />
			</div>
			<div class="w-full">
				<label for="password" class="block mb-1"><h5>Passord</h5></label>
				<input type="password" name="password" class="input w-full" placeholder="" required />
			</div>
			<div>
				<input type="submit" class="btn" value={'Registrer'} />
			</div>
		</div>
	</form>

	<!-- pretty lazy way of doing it but eh -->

	{#if form?.formHints}
		{#each form.formHints as hint}
			<p>{hint}</p>
		{/each}
	{/if}

	{#if form?.message}
		<p class="text-center text-green-400">{form.message}</p>
	{/if}
</div>
