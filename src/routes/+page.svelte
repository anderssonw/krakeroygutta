<script lang="ts">
	let { data } = $props();
	let { season } = $derived(data);
</script>

<h1>{JSON.stringify(season, null, 2)}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
