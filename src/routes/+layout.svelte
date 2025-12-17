<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import './layout.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>Kråkerøy Gutta</title>
	<meta name="description" content="Kråkerøygutta sin offisielle nettside!" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<ToastContainer />
<NavBar profile={data.profile} />

{@render children()}
