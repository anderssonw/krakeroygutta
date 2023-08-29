<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

	// Get server data
	export let data: PageData;
	export let form: ActionData;
	$: ({ user } = data);
</script>

{JSON.stringify(user)}
<form method="POST">
	<button>Logg ut</button>
</form>

{#if form?.errors}
	{#each Object.values(form?.errors) as error}
		<p class="text-red-700 pa-0 ma-0">{error}</p>
	{/each}
{/if}
