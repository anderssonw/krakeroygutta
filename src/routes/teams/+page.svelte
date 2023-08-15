<script lang="ts">
	import Teams from "$lib/components/teams/Teams.svelte";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

        // Get server data
	export let data: PageData;
    $: ({ session, teams, players } = data)

        // Protect route
        onMount(async () => {
        if (!session){
            goto("/login")
        }
    });
</script>

{#if session}
    <Teams teams={teams} players={players} />
{:else}
    <div class="structure">
        <h2 class="text-center"> Redirecting .. <SpinnerIcon /> </h2>
    </div>
{/if}