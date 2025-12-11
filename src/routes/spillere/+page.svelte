<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let { players, currentSeason } = $derived(data);
</script>
