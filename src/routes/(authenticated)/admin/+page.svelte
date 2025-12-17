<script lang="ts">
	import { clsx } from 'clsx';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { PageProps } from './$types';
	import { getFullRoute, getVisibleRoutes } from '$lib/routing';

	let { data }: PageProps = $props();

	const adminSections = [
		{
			title: 'Sesonger',
			description: 'Administrer sesonger',
			icon: '🏆',
			href: '/admin/seasons',
			color: 'from-blue-500/10 to-blue-600/10'
		},
		{
			title: 'Spillere',
			description: 'Rediger spillerinformasjon for en sesong',
			icon: '⚽',
			href: '/admin/players',
			color: 'from-green-500/10 to-green-600/10'
		},
		{
			title: 'Lag',
			description: 'Opprett og administrer lag for en sesong',
			icon: '👥',
			href: '/admin/teams',
			color: 'from-purple-500/10 to-purple-600/10'
		},
		{
			title: 'Kamper',
			description: 'Legg til kamper og resultater for en sesong',
			icon: '🎮',
			href: '/admin/matches',
			color: 'from-orange-500/10 to-orange-600/10'
		}
		// {
		// 	title: 'Fantasy',
		// 	description: 'Administrer fantasy-innstillinger',
		// 	icon: '✨',
		// 	href: '/admin/fantasy',
		// 	color: 'from-pink-500/10 to-pink-600/10'
		// },
		// {
		// 	title: 'Brukere',
		// 	description: 'Behandle tilganger og roller',
		// 	icon: '👤',
		// 	href: '/admin/users',
		// 	color: 'from-red-500/10 to-red-600/10'
		// }
	];

	type AdminRouteInfo = {
		description: string;
		icon: string;
		color: string;
	};
	const adminRouteInfos: Record<string, AdminRouteInfo> = {
		'/sesonger': {
			description: 'Administrer sesonger',
			icon: '🏆',
			color: 'from-blue-500/10 to-blue-600/10'
		},
		'/spillere': {
			description: 'Rediger spillerinformasjon for en sesong',
			icon: '⚽',
			color: 'from-green-500/10 to-green-600/10'
		},
		'/lag': {
			description: 'Opprett og administrer lag for en sesong',
			icon: '👥',
			color: 'from-purple-500/10 to-purple-600/10'
		},
		'/kamper': {
			description: 'Legg til kamper og resultater for en sesong',
			icon: '🎮',
			color: 'from-orange-500/10 to-orange-600/10'
		}
	};

	const adminRoutes = $derived(getVisibleRoutes(data.profile).find((route) => route.visibility === 'admin')?.subRoutes ?? []);
</script>

<div class="container mx-auto max-w-7xl px-4 py-8 md:px-6">
	<div class="mb-8 space-y-2">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Adminpanel</h1>
		<p class="text-muted-foreground">Administrer alle aspekter av Kråkerøygutta</p>
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each adminRoutes as adminRoute}
			{@render adminCard({
				title: adminRoute.label,
				description: adminRouteInfos[adminRoute.href]?.description || 'Administrer denne seksjonen',
				icon: adminRouteInfos[adminRoute.href]?.icon || '🛠️',
				href: getFullRoute(adminRoute),
				color: adminRouteInfos[adminRoute.href]?.color || 'from-gray-500/10 to-gray-600/10'
			})}
		{/each}
	</div>
</div>

{#snippet adminCard(section: { title: string; description: string; icon: string; href: string; color: string })}
	<Card class="group cursor-pointer bg-linear-to-br transition-all hover:scale-[102%] hover:shadow-lg">
		<a href={section.href} class="block">
			<CardHeader class={clsx('space-y-2 bg-linear-to-br py-2 lg:py-4', section.color)}>
				<div class="flex items-center gap-2 lg:items-start lg:justify-between">
					<div class="self-center text-xl transition-transform group-hover:scale-110 lg:order-2 lg:text-4xl">
						{section.icon}
					</div>
					<CardTitle class="self-center text-base lg:order-1 lg:text-xl">{section.title}</CardTitle>
				</div>
				<CardDescription class="h-12 text-xs md:h-8 lg:text-sm">{section.description}</CardDescription>
			</CardHeader>
			<CardContent class="pt-3 lg:pt-4">
				<Button variant="outline" size="sm" class="lg:size-default w-full text-xs lg:text-sm">Åpne</Button>
			</CardContent>
		</a>
	</Card>
{/snippet}
