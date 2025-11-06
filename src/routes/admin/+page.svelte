<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	const { user } = data;
</script>

<div class="structure">
	<h1>Administrasjon</h1>
	{#if user?.is_superadmin}
		<button class="btn" on:click={() => goto('/admin/seasons')}> Administrer sesonger </button>
		<button class="btn" on:click={() => goto('/admin/teams')}> Administrer lag </button>
	{/if}
	<button class="btn" on:click={() => goto('/admin/matches')}> Administrer kamper </button>
</div>
