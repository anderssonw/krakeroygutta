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

	$: ({ supabase, session, user } = data);

	$: isAdmin = user?.is_admin ?? false;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>


<div class="{screenHeight}">
	<Navbar isAdmin={isAdmin} bind:showMobileNavbar={showMobileNavbar} />

	<slot />

	<Footer />
</div>
