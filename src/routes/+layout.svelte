<script lang="ts">
	import './layout.css';

	let { children, data } = $props();

	const links = [{ href: '/', label: 'Hjem' }];

	const unAuthenticatedLinks = [{ href: '/login', label: 'Logg inn' }];

	const authenticatedLinks = [
		{ href: '/spillere', label: 'Spillere' },
		{ href: '/statistikk', label: 'Statistikk' },
		{ href: '/profil', label: 'Profil' }
	];
</script>

<svelte:head>
	<title>Kråkerøy Gutta</title>
	<meta name="description" content="Kråkerøygutta sin offisielle nettside!" />
	<link rel="icon" href="/favicon.ico" />
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<div>
	<div class="w-full p-4 flex justify-end sticky top-0 bg-slate-700 shadow-md">
		{#each links as link}
			<a class="mx-2" href={link.href}>{link.label}</a>
		{/each}

		{#if data.user}
			{#each authenticatedLinks as link}
				<a class="mx-2" href={link.href}>{link.label}</a>
			{/each}
		{:else}
			{#each unAuthenticatedLinks as link}
				<a class="mx-2" href={link.href}>{link.label}</a>
			{/each}
		{/if}
	</div>

	{@render children()}
</div>
