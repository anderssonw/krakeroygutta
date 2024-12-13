<script lang="ts">
	import type { ActionData, PageData } from './$types';

	// Get server data
	export let data: PageData;
	export let form: ActionData;
	$: ({ player, user } = data);
</script>

<div class="flex flex-col items-center py-8">
	{#await player}
		<p>Laster</p>
	{:then player}
		{#if user}
			<div class="flex flex-col items-center space-y-4">
				<h1>Hei {user.nickname}!</h1>
				{#if player}
					<h3>Brukernavn: {user.nickname}</h3>
					<h3>Din id: {player.id}</h3>
					<img class="h-64" src={player.image} alt="head" />
				{:else}
					<p>Du har ikke en spiller knyttet til profilen din. Kontakt Magnus eller William for å gjøre dette.</p>
				{/if}
			</div>
		{/if}
	{/await}
	<form class="py-4" method="POST">
		<button class="btn">Logg ut</button>
	</form>
</div>

{#if form?.errors}
	{#each Object.values(form?.errors) as error}
		<p class="text-red-700 pa-0 ma-0">{error}</p>
	{/each}
{/if}
