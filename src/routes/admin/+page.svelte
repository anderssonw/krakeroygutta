<script lang="ts">
	import AdmMatches from '$lib/components/admin/AdmMatches.svelte';
	import AdmSeasons from '$lib/components/admin/AdmSeasons.svelte';
	import AdmTeams from '$lib/components/admin/AdmTeams.svelte';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	const { user } = data;
</script>

<div class="structure">
	{#if user?.is_superadmin}
		<AdmSeasons />
		<AdmTeams />
	{/if}
	<AdmMatches />
</div>
