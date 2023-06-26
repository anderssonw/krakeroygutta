<script lang="ts">
	import { goto } from '$app/navigation';
    import Fantasy from '$lib/components/fantasy/Fantasy.svelte';
    import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

    // Get server data
	export let data: PageData;
    $: ({ session, players, user } = data)

    // Protect route
    onMount(async () => {
        if (!session){
            goto("/login")
        }
    });
</script>

{#if session && user}
    <Fantasy players={players} user={user} />
{:else}
    <div class="structure">
        <h2 class="text-center"> Redirecting .. <SpinnerIcon /> </h2>
    </div>
{/if}
