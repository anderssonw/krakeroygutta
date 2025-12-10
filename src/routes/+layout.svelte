<script lang="ts">
	import './layout.css';

	let { children, data } = $props();

	let { user, profile, currentSeason } = $derived(data);

	const links = [
		{ href: '/', label: 'Hjem' },
		{ href: '/statistikk', label: 'Statistikk' }
	];

	const authenticatedLinks = [{ href: '/profil', label: 'Profil' }];
</script>

<svelte:head />

<div>
	<div class="w-full p-4 flex justify-end sticky top-0 bg-slate-700 shadow-md">
		{#each links as link}
			<a class="mx-2" href={link.href}>{link.label}</a>
		{/each}

		{#if user}
			{#each authenticatedLinks as link}
				<a class="mx-2" href={link.href}>{link.label}</a>
			{/each}
		{:else}
			<a class="mx-2" href="/login">Logg inn</a>
		{/if}
	</div>

	{@render children()}
</div>
