<script lang="ts">
	import type { LayoutProps } from './$types';

	import * as Select from '$lib/components/ui/select/index.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Label } from '$lib/components/ui/label';

	let { data, children }: LayoutProps = $props();

	let { seasons, currentSeason } = $derived(data);

	onMount(() => {
		const currentSeasonIdParam = page.url.searchParams.get('seasonId');
		if (currentSeason && !currentSeasonIdParam) {
			const url = new URL(page.url);
			url.searchParams.set('seasonId', currentSeason.id.toString());
			goto(url, { replaceState: true });
		}
	});

	let seasonId = $derived(page.url.searchParams.get('seasonId') ?? undefined);
</script>

<div class="mt-4 flex flex-col items-center">
	<div class="space-y-2">
		<Label class="text-lg font-semibold">Velg sesong</Label>
		<Select.Root
			type="single"
			value={seasonId}
			onValueChange={(newValue) => {
				if (!newValue) return;

				const url = new URL(page.url);
				url.searchParams.set('seasonId', newValue);
				goto(url);
			}}
		>
			<Select.Trigger>
				{seasons.find((season) => season.id.toString() === seasonId)?.name ?? 'Velg sesong'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Sesong</Select.Label>
					{#each seasons as season (season.id)}
						<Select.Item value={season.id.toString()} label={season.name}>
							{season.name}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>

{@render children()}
