<script lang="ts">
	import { getFullRoute, getVisibleRoutes } from '$lib/routing';
	import type { Profile } from '$lib/types/database-helpers';
	import { page } from '$app/state';
	import HamburgerMenuIcon from '~icons/mdi/hamburger-menu';
	import CloseIcon from '~icons/mdi/close';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
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

{#snippet logoButton()}
	<Button variant="ghost" href={routesToUse[0]?.href || '/'} onclick={() => (showMobileNavBar = false)}>
		<enhanced:img src={headerSmallDisco} alt="Kråkerøy Gutta Logo" class="h-8 w-auto" />
	</Button>
{/snippet}

<div class="hidden w-full items-center justify-between bg-accent px-4 py-4 md:flex">
	{@render logoButton()}
	<NavigationMenu.Root class="z-40 flex justify-between" viewport={false}>
		<NavigationMenu.List>
			{#each routesToUse.slice(1) as route}
				{@const RouteIcon = route.icon}
				{#if route.subRoutes && route.subRoutes.length > 0}
					<NavigationMenu.Item class={cn('hidden md:block', isActiveRoute(route.href) && 'border-b-2 border-primary text-primary')}>
						<NavigationMenu.Trigger class="rounded-none bg-accent">
							<NavigationMenu.Link href={route.href} class="flex-row items-center gap-2 rounded-none">
								<RouteIcon class="h-5 w-5" />
								{route.label}
							</NavigationMenu.Link>
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="p-0">
							<ul class="grid gap-4 p-2">
								{#each route.subRoutes as subRoute}
									{@const SubRouteIcon = subRoute.icon}
									<li>
										<NavigationMenu.Link
											href={getFullRoute(subRoute)}
											class={cn(
												'flex-row items-center gap-2 p-4',
												isActiveRoute(getFullRoute(subRoute)) ? 'bg-primary/10 text-primary' : 'text-foreground/70'
											)}
										>
											<SubRouteIcon class="h-4 w-4" />
											{subRoute.label}
										</NavigationMenu.Link>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
				{:else}
					<NavigationMenu.Item class={cn(isActiveRoute(route.href) && 'border-b-2 border-primary text-primary')}>
						<NavigationMenu.Link href={route.href} class="flex-row items-center gap-2 rounded-none p-4">
							<RouteIcon class="h-5 w-5" />
							{route.label}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
			{/each}
		</NavigationMenu.List>
	</NavigationMenu.Root>
</div>

<nav class="flex justify-between bg-accent px-4 py-4 md:hidden">
	{@render logoButton()}

	<button
		class="flex h-8 w-8 items-center justify-center"
		onclick={() => {
			window.scrollTo(0, 0);
			showMobileNavBar = !showMobileNavBar;
		}}
	>
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
					class={cn(
						'flex items-center gap-3 text-sm transition-colors',
						'active:border-r-4 active:border-primary active:bg-primary/10 active:text-primary',
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
