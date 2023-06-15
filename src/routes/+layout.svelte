<script lang="ts">
	import "../app.postcss";
    import { supabase } from '$lib/supabase';
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { User } from '$lib/types/User';
	import Navbar from "$lib/components/index/Navbar.svelte";
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

<Navbar />

<slot></slot>

