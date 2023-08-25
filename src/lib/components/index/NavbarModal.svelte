<script lang="ts">
	import { page } from '$app/stores';

    export let isAdmin: boolean;
	export let showMobileNavbar: boolean;

    $: navbarAnimation = `transition-all duration-500 ${showMobileNavbar ? 'translate-x-0' : '-translate-x-full'}`;
</script>


<div class="fixed bottom-0 top-0 right-0 left-0 z-50 bg-secondary-color-dark {navbarAnimation}">
    <div class="text-primary-color-dark absolute top-10 right-10 hover:cursor-pointer" on:mouseup={() => showMobileNavbar = false}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    </div>

    {#if $page.data.user}
        <div class="structure">
            <a href="/" on:mouseup={() => showMobileNavbar = false}> <h5 class="navbtn text-primary-color-dark">Sesong</h5> </a>
            <a href="/fantasy" on:mouseup={() => showMobileNavbar = false}> <h5 class="navbtn text-primary-color-dark">Mitt lag</h5> </a>
            {#if isAdmin}
                <a href="/admin" on:mouseup={() => showMobileNavbar = false}> <h5 class="navbtn text-primary-color-dark">Admin</h5> </a>
            {/if}
            <a href="/profile" on:mouseup={() => showMobileNavbar = false}> <h5 class="navbtn text-primary-color-dark">Profil</h5> </a>
        </div>
    {:else}
        <div class="structure">
            <a href="/" on:mouseup={() => showMobileNavbar = false}> <h3 class="navbtn text-primary-color-dark">Hjem</h3> </a>
            <a href="/login" on:mouseup={() => showMobileNavbar = false}> <h3 class="navbtn text-primary-color-dark">Logg inn</h3> </a>
            <a href="/register" on:mouseup={() => showMobileNavbar = false}> <h3 class="navbtn text-primary-color-dark">Registrer deg</h3> </a>
        </div>
    {/if}
</div>