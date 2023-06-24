<script lang="ts">
	import "../app.postcss";
    import { supabase } from '$lib/supabase';
    import { invalidateAll } from '$app/navigation';
    import { onMount } from 'svelte';
	import Navbar from "$lib/components/index/Navbar.svelte";
	import Footer from "$lib/components/index/Footer.svelte";

    onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Navbar />

<slot></slot>

<Footer/>

