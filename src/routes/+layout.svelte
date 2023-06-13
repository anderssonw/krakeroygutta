<script lang="ts">
	import "../app.postcss";
    import { supabase } from '$lib/supabase';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import type { User } from '$lib/types/User';
    /** @type {import('./$types').PageData} */
    export let data;
    let user: User = data.user;

    onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<ul class="navBar">
	{#if user?.isAdmin}
		<li><a href="/admin">Adminpanel</a></li>
	{:else}
		<li></li>
	{/if}
	<!-- <li><a href="/">Hjem</a></li> -->
	<!-- <li><a href="/fantasy">Fantasy</a></li> -->
	{#if !$page.data.session}
		<li><a href="/login">Logg Inn</a></li>
	{:else}
		<li><a href="/profile">Profil</a></li>
	{/if}
</ul>

<slot></slot>

