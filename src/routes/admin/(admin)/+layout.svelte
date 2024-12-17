<script>
	import ReturnToRoute from '$lib/components/common/ReturnToRoute.svelte';
</script>

<div class="structure">
	<ReturnToRoute text="Tilbake til hovedadminside" route="/admin" />
	<slot />
</div>
