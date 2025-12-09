<script lang="ts">
	import PlayerImage from '$lib/components/PlayerImage.svelte';

	interface PickEntry {
		id: number;
		name: string;
		image: string | null;
		pickCount: number;
		rank: number;
	}

	interface Props {
		picks: PickEntry[];
	}

	let { picks }: Props = $props();
</script>

<div class="space-y-3">
	{#each picks as pick}
		<div class="flex items-center gap-3">
			<span class="w-6 text-lg font-semibold text-muted-foreground">#{pick.rank}</span>
			<PlayerImage src={pick.image} alt={pick.name} size="md" />
			<span class="flex-1 font-medium">{pick.name}</span>
			<span class="text-xl font-bold">{pick.pickCount} lag</span>
		</div>
	{/each}
</div>
