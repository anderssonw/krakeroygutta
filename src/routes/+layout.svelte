<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { User } from '$lib/types/User';
	/** @type {import('./$types').PageData} */
	export let data;
	let user: User = data.user;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<ul class="navBar">
	{#if user?.isAdmin}
		<li><a href="/admin">Adminpanel</a></li>
	{:else}
		<li />
	{/if}
	<li><a href="/">Hjem</a></li>
	<li><a href="/fantasy">Fantasy</a></li>
	{#if !$page.data.session}
		<li><a href="/login">Logg Inn</a></li>
	{:else}
		<li><a href="/profile">Profil</a></li>
	{/if}
</ul>
<p class="importantMessage">Jørgen er fet</p>

<div class="content">
	<slot />
</div>

<style>
	.content {
		max-width: 900px;
		margin: 0 auto;
	}
	.navBar {
		display: grid;
		grid-template-columns: 1fr repeat(2, auto) 1fr;
		grid-column-gap: 5px;
		justify-items: center;
		list-style: none;
		padding: 0;
	}

	/* li:nth-child(1) {
		grid-column-start: 2;
	}*/

	li:first-child {
		margin-right: auto;
	}
	li:last-child {
		margin-left: auto;
	}

	a {
		text-decoration: none;
	}

	.importantMessage {
		position: fixed;
		bottom: 0;
		right: 10px;
		font-size: xx-small;
		opacity: 40%;
	}
</style>
