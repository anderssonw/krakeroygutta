<script>
	import ReturnToRoute from '$lib/components/common/ReturnToRoute.svelte';
</script>

<div class="structure px-4">
	<ReturnToRoute text="Tilbake til hovedadminside" route="/admin" />
	<slot />
</div>
