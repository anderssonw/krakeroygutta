<script lang="ts">
	import type { User } from '$lib/types/User';

	/** @type {import('./$types').PageData} */
	export let data;

	let user: User = data.user;
</script>

<main class="content">Skkrt</main>

<style>
	.content {
		text-align: center;
	}
</style>
