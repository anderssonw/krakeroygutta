<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import { confirmationDialog } from '$lib/stores/confirmationDialog';
	import './layout.css';

	import '@fontsource/mr-dafoe';
	import '@fontsource/allison';
	import '@fontsource/mrs-saint-delafield';

	let { children, data } = $props();

	let dialogs = $derived($confirmationDialog);
</script>

<svelte:head>
	<title>Kråkerøygutta Fantasy</title>
	<meta name="description" content="Kråkerøygutta sin offisielle nettside!" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<ToastContainer />
{#each dialogs as dialog (dialog.id)}
	<ConfirmationDialog id={dialog.id} options={dialog.options} />
{/each}
<NavBar profile={data.profile} />

{@render children()}
