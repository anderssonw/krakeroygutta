<script lang="ts">
	import LargeLogo from '$lib/components/common/LargeLogo.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email: string;
	let password: string;

	let loading = false;
	let serverError = '';
</script>

<div class="structure">
	<LargeLogo />

	<h3>Innlogging</h3>

	<form class="form" method="POST">
		<div class="form-structure">
			<div class="w-full">
				<label for="email" class="block mb-1"><h5>Epost</h5></label>
				<input name="email" type="email" id="email" class="input w-full" placeholder="næbb@næbbesen.no" bind:value={email} required />
			</div>
			<div class="w-full">
				<label for="password" class="block mb-1"><h5>Passord</h5></label>
				<input name="password" type="password" id="password" class="input w-full" placeholder="" bind:value={password} required />
			</div>
			<div>
				<button class="btn">{loading ? 'Laster' : 'Logg deg inn'}</button>
			</div>
		</div>

		{#if form?.errors}
			{#each Object.values(form?.errors) as error}
				<p class="text-red-700 pa-0 ma-0">{error}</p>
			{/each}
		{/if}
	</form>
</div>
