<script lang="ts">
	import { getVisibleRoutes } from '$lib/routing';
	import type { Profile } from '$lib/types/database-helpers';
	import { page } from '$app/state';
	import clsx from 'clsx';

	type Props = {
		profile: Profile | null;
	};
	let { profile }: Props = $props();

	const routesToUse = $derived(getVisibleRoutes(profile));

	function isActiveRoute(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<nav class="sticky top-0 z-10 flex w-full justify-end bg-slate-700 p-4 shadow-md">
	{#each routesToUse as route}
		<a
			href={route.href}
			class={clsx('ml-4 text-white transition-colors', isActiveRoute(route.href) ? 'font-bold underline' : 'hover:underline')}
		>
			{route.label}
		</a>
	{/each}
</nav>
