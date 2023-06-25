<script>
	import { page } from '$app/stores';
</script>

<main>
	<h1>{$page.status}: {$page.error?.message}</h1>
</main>

<style>
	main {
		text-align: center;
	}
</style>
