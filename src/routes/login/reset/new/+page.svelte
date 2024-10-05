<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;

	let password: string;
	let repeatPassword: string;

	let loading = false;
</script>

<div class="structure">
	<h3>Sett nytt passord</h3>

	<form class="form" method="POST">
		<div class="form-structure">
			<div class="w-full">
				<label for="password" class="block mb-1"><h5>Passord</h5></label>
				<input name="password" type="password" id="password" class="input w-full" placeholder="" bind:value={password} required />
			</div>
			<div>
				<button class="btn">{loading ? 'Laster' : 'Sett nytt passord'}</button>
			</div>

			{#if form != null}
				{#if form?.errors}
					{#each Object.values(form?.errors) as error}
						<p class="text-red-700 pa-0 ma-0">{error}</p>
					{/each}
				{:else}
					<p>Passordet har blitt satt, vennligst logg inn</p>
				{/if}
			{/if}
		</div>
	</form>
</div>
