<script lang="ts">
	import { cn } from '$lib/utils';
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { getFullRoute, type RouteLink } from '$lib/routing';

	type Props = {
		route: RouteLink;
	};

	let { route }: Props = $props();

	const Icon = $derived(route.icon);
</script>

<Card class={cn('group cursor-pointer overflow-hidden transition-all hover:scale-[102%] hover:shadow-lg', route.color)}>
	<a href={getFullRoute(route)} class="block">
		<CardHeader class={'space-y-2 py-2 lg:py-4'}>
			<div class="flex items-center gap-2">
				<div class="self-center transition-transform group-hover:scale-120">
					<Icon class="h-6 w-6 lg:h-10 lg:w-10" />
				</div>
				<CardTitle class="self-center text-base lg:text-xl">{route.label}</CardTitle>
			</div>
			<CardDescription class="h-12 text-sm md:h-8 lg:text-base">
				{route.description}
			</CardDescription>
		</CardHeader>
	</a>
</Card>
