<script lang="ts">
	import { goto } from '$app/navigation';
    import Fantasy from '$lib/components/fantasy/Fantasy.svelte';
    import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

    // Get server data
	export let data: PageData;
    $: ({ session, user, fantasy, players, activeSeason } = data)

    // Protect route
    onMount(async () => {
        if (!session){
            goto("/login")
        }
    });
</script>

{#if session && user}
    <Fantasy user={user} activeSeason={activeSeason} fantasy={fantasy} players={players} />
{:else}
    <div class="structure">
        <h2 class="text-center"> Redirecting .. <SpinnerIcon /> </h2>
    </div>
{/if}
