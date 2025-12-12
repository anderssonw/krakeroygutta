<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import './layout.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>Kråkerøy Gutta</title>
	<meta name="description" content="Kråkerøygutta sin offisielle nettside!" />
	<link rel="icon" href="/favicon.ico" />
	<script src="https://accounts.google.com/gsi/client" async></script>
</svelte:head>

<div>
	<NavBar profile={data.profile} />

	{@render children()}
</div>
