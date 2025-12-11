<script lang="ts">
	import type { PageProps } from '../profil/$types';

	let { data }: PageProps = $props();
</script>

<h1 class="text-2xl font-bold mb-4">Profilside</h1>

{#if data.profile}
	<p>Velkommen, {data.profile.nickname}!</p>
	<p>E-post: {data.user?.email}</p>
{:else}
	<p>Ingen profilinformasjon tilgjengelig.</p>
{/if}

<form method="POST">
	<button>Logg ut</button>
</form>
