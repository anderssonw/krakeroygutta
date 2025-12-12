<script lang="ts">
	import type { PageProps } from '../profil/$types';

	let { data }: PageProps = $props();
</script>

<h1 class="mb-4 text-2xl font-bold">Profilside</h1>

{#if data.profile}
	<p>Velkommen, {data.profile.nickname}!</p>
{:else}
	<p>Ingen profilinformasjon tilgjengelig.</p>
{/if}

<form method="POST">
	<button>Logg ut</button>
</form>
