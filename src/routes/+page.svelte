<script lang="ts">
	let { data } = $props();
	let { season } = $derived(data);
</script>

<div class="container mx-auto my-4 text-center">
	{#if season}
		<h2 class="mb-4 text-2xl font-bold">Velkommen til sesongen {season.name}!</h2>
	{:else}
		<h2 class="mb-4 text-2xl font-bold">Ingen aktiv sesong</h2>
		<p>Vennligst sjekk tilbake senere for oppdateringer.</p>
	{/if}
</div>
