<script lang="ts">
	import Content from '$lib/components/index/Content.svelte';
	import Season from '$lib/components/index/Season.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ session, season, teams } = data)
</script>


{#if session}
	<Season season={season} teams={teams} />
{:else}
	<Content/>
{/if}
