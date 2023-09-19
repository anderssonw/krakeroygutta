<script lang="ts">
	import TextField from '$lib/components/common/TextField.svelte';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;

	$: ({ teams, seasonId } = data);
</script>

<div class="structure">
	{#if teams}
		{#each teams as team}
			<p>{team.name}</p>
		{/each}
	{/if}

	{#if seasonId}
		<h4>Legg til nytt lag</h4>

		<form class="form" method="POST">
			<div class="form-structure">
				<TextField header="Lagnavn" label="teamName" type="text" placeholder="Gutta G" />
				<TextField header="Lagfarge" label="teamColor" type="text" placeholder="Svart" />
				<button type="submit" class="btn">Legg til</button>
			</div>
		</form>
	{/if}
</div>
