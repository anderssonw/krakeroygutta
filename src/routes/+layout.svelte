<script lang="ts">
	import '../app.postcss';
	import Navbar from '$lib/components/index/Navbar.svelte';
	import Footer from '$lib/components/index/Footer.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// Necessary for the navbar(mobile) modal
	let showMobileNavbar: boolean = false;
	$: screenHeight = `${showMobileNavbar ? 'h-screen overflow-y-hidden' : 'overflow-y-visible'}`;
	$: ({ session, supabase, user } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class={screenHeight}>
	<Navbar bind:session bind:user bind:showMobileNavbar />

	<slot />

	<Footer />
</div>
