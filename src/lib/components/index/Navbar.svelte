<script>
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase';
    import { goto } from '$app/navigation';

    const logOut = async () => {
		try {
			await supabase.auth.signOut();
			goto('/login');
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div
  class="bg-gradient-to-b from-black/75 h-20 md:h-32 flex justify-end items-center px-8 md:px-20"
>
    <a href="/register"> <h2> Registrer deg </h2> </a>
    {#if $page.data.session}
        <button on:click={logOut}> <h2> Logg ut </h2> </button>
    {:else}
        <a href="/login"> <h2> Logg inn </h2> </a>
    {/if}
</div>
