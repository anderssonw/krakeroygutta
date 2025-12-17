<script lang="ts">
	import { getFullRoute, getVisibleRoutes } from '$lib/routing';
	import type { Profile } from '$lib/types/database-helpers';
	import { page } from '$app/state';
	import HamburgerMenuIcon from '~icons/mdi/hamburger-menu';
	import CloseIcon from '~icons/mdi/close';
	import { fly } from 'svelte/transition';
	import clsx from 'clsx';

	import headerSmallDisco from '$lib/assets/headerSmallDisco.png';
	import { Button } from './ui/button';
	import { sineInOut } from 'svelte/easing';
	import { type Component } from 'svelte';

	type Props = {
		profile: Profile | null;
	};
	let { profile }: Props = $props();

	const routesToUse = $derived(getVisibleRoutes(profile));

	function isActiveRoute(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}

	let showMobileNavBar = $state(false);

	// Prevent scrolling when mobile navbar is open
	$effect(() => {
		document.body.style.overflow = showMobileNavBar ? 'hidden' : '';
	});

	// Close navbar on navigation
	$effect(() => {
		page.url.pathname;
		showMobileNavBar = false;
	});
</script>

<nav class="space-between hidden w-full justify-around bg-accent px-2 py-4 md:flex">
	{#each routesToUse as route, index}
		<a href={route.href}>
			{route.label}
		</a>
	{/each}
</nav>

<nav class="flex justify-between bg-accent px-4 py-4 md:hidden">
	<Button variant="ghost" href={routesToUse[0]?.href || '/'} onclick={() => (showMobileNavBar = false)}>
		<img src={headerSmallDisco} alt="Kråkerøy Gutta Logo" class="h-8 w-auto" />
	</Button>

	<button class="flex h-8 w-8 items-center justify-center" onclick={() => (showMobileNavBar = !showMobileNavBar)}>
		{#if showMobileNavBar}
			<CloseIcon />
		{:else}
			<HamburgerMenuIcon />
		{/if}
	</button>
	{#if showMobileNavBar}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={(e) => {
				if (e.target === e.currentTarget) showMobileNavBar = false;
			}}
			class="fixed inset-0 top-17 z-40 before:absolute before:inset-0 before:bg-black/50"
		>
			{#snippet navItem(href: string, label: string, icon: Component, isSubRoute = false)}
				{@const Icon = icon}
				<a
					{href}
					class={clsx(
						'flex items-center gap-3 text-sm',
						isSubRoute ? 'py-2.5 pr-6 pl-12' : 'px-6 py-3 font-medium',
						isActiveRoute(href)
							? 'border-r-4 border-primary bg-primary/10 text-primary'
							: isSubRoute
								? 'text-foreground/70'
								: 'text-foreground/80'
					)}
				>
					<Icon class={isSubRoute ? 'h-4 w-4' : 'h-5 w-5'} />
					{label}
				</a>
			{/snippet}

			<div
				transition:fly={{ x: 200, duration: 300, easing: sineInOut }}
				class="absolute top-0 right-0 z-50 flex h-full w-64 flex-col bg-accent shadow-lg"
			>
				{#each routesToUse.slice(1) as route}
					{@render navItem(route.href, route.label, route.icon)}
					{#if route.subRoutes}
						{#each route.subRoutes as subRoute}
							{@render navItem(getFullRoute(subRoute), subRoute.label, subRoute.icon, true)}
						{/each}
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</nav>
