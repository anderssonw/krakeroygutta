<script lang="ts">
	import type { Tables } from '$lib/types/database.helper.types';
	import { afterUpdate } from 'svelte';
	import NavbarModal from './NavbarModal.svelte';
	import type { Session } from '@supabase/supabase-js';
	import { navAdminRoutes, navNoSessionRoutes, navSessionRoutes, type MainRoute, } from '$lib/shared/routes';
	import smallHeaderLogo from '$lib/assets/headerSmallXmas.png';

	import HamburgerIcon from 'virtual:icons/mdi/hamburger-menu';

	export let session: Session | null;
	export let user: Tables<'users'> | null;
	export let showMobileNavbar: boolean;

	let routes: MainRoute[] = getRoutes(session, user);
	function getRoutes(session: Session | null, user: Tables<'users'> | null) {
		let allRoutes: MainRoute[] = session ? navSessionRoutes : navNoSessionRoutes;

		if (session && (user?.is_admin || user?.is_superadmin)) {
			allRoutes = allRoutes.concat(navAdminRoutes);
		}

		return allRoutes;
	}

	$: isHoveringSeason = false;

	let browserWidth = 0;
	$: isMobile = browserWidth <= 766;

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

<div class="nav flex items-center {isMobile ? "" : hideNavbar}">
	<a href="/">
		<div class="w-16 tablet:w-28 flex flex-row">
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
				{#if route.subRoute.length > 0}
					<div class="relative flex"
						on:mouseenter={() => isHoveringSeason = true}
						on:mouseleave={() => isHoveringSeason = false}>
						<a href={route.route.url}> 
							<h5 class="navbtn">{route.route.name}</h5> 
						</a>
						{#if isHoveringSeason}
							<div class="w-full p-1 rounded absolute top-[100%] left-1/2 -translate-x-1/2 bg-primary-color-light flex flex-col gap-2">
								{#each route.subRoute as subRoute}
									<a href={subRoute.url} class="p-1"> 
										<h5>{subRoute.name}</h5> 
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<a href={route.route.url}> 
						<h5 class="navbtn">{route.route.name}</h5> 
					</a>
				{/if}
				
			{/each}
		</div>
	</div>
</div>

<NavbarModal {routes} bind:showMobileNavbar />

<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={newY} bind:outerWidth={browserWidth} />
