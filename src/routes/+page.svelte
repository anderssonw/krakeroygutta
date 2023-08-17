<script lang="ts">
	import Content from '$lib/components/index/Content.svelte';
	import Season from '$lib/components/index/Season.svelte';

	// Get data from server if logged in
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ session, activeSeason, teams, fantasyTeams, playerPoints } = data);
</script>

{#if session}
	<Season {activeSeason} {teams} {fantasyTeams} {playerPoints} />
{:else}
	<Content />
{/if}
