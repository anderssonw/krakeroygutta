<script lang="ts">
	import type { Tables } from '$lib/types/database.helper.types';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import NavbarModal from './NavbarModal.svelte';
	import type { Session } from '@supabase/supabase-js';
	import { navAdminRoutes, navNoSessionRoutes, navSessionRoutes, type Route } from '$lib/shared/routes';
	import smallHeaderLogo from '$lib/assets/headerSmall.png';

	import HamburgerIcon from 'virtual:icons/mdi/hamburger-menu';

	export let session: Session | null;
	export let user: Tables<'users'> | null;
	export let showMobileNavbar: boolean;

	let routes: Route[] = getRoutes(session, user);
	function getRoutes(session: Session | null, user: Tables<'users'> | null) {
		let allRoutes: Route[] = session ? navSessionRoutes : navNoSessionRoutes;

		if (session && (user?.is_admin || user?.is_superadmin)) {
			allRoutes = allRoutes.concat(navAdminRoutes);
		}

		return allRoutes;
	}

	let oldY = 0;
	let newY = oldY;
	let scrolling = false;
	$: hideNavbar = `transition-all duration-1000 ${scrolling ? '-translate-y-full' : 'translate-y-0'}`;
	afterUpdate(() => {
		if (newY > oldY) {
			scrolling = true;
		} else {
			scrolling = false;
		}
		oldY = newY;
	});
</script>

<div class="nav flex items-center {hideNavbar}">
	<a href="/">
		<div class="w-28 flex flex-row">
			<img src={smallHeaderLogo} alt="trophy" />
		</div>
	</a>
	<div class="w-full flex flex-row justify-end">
		<!-- Mobile Nav -->
		<div class="space-y-2 tablet:hidden">
			<button class="hover:cursor-pointer text-3xl" on:click={() => (showMobileNavbar = true)}>
				<HamburgerIcon />
			</button>
		</div>
		<!-- Else Nav -->
		<div class="hidden tablet:flex">
			{#each routes as route}
				<a href={route.route}> <h5 class="navbtn">{route.name}</h5> </a>
			{/each}
		</div>
	</div>
</div>

<NavbarModal {routes} bind:showMobileNavbar />

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={newY} />
