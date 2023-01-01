<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

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
	<li><a href="/">Hjem</a></li>
	<li><a href="/fantasy">Fantasy</a></li>
	<li><a href="/login">Log Inn</a></li>
	<li><a href="/profile">Profile</a></li>
</ul>
<p class="importantMessage">Jørgen er fet</p>

<slot />

<style>
	.navBar {
		display: grid;
		grid-template-columns: 1fr repeat(3, auto) 1fr;
		grid-column-gap: 5px;
		justify-items: center;
		list-style: none;
	}

	li:nth-child(1) {
		grid-column-start: 2;
	}
	li:nth-child(4) {
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
