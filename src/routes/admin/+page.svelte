<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import Admin from '$lib/components/admin/Admin.svelte';

	// Get server data
	export let data: PageData;
    $: ({ session, user } = data)

    // Protect route
    onMount(async () => {
        if (!session){
            goto("/login");
        }
		if (!user.IsAdmin){
			goto("/");
		}
    });
</script>

{#if (session && user.IsAdmin)}
	<Admin />
{:else}
    <div class="structure">
        <h2 class="text-center"> Redirecting .. <SpinnerIcon /> </h2>
    </div>
{/if}
