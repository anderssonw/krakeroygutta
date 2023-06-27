<script lang="ts">
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
	import { afterUpdate } from 'svelte';

    export let isAdmin: boolean;

    let oldY = 0;
    let newY = oldY;
    let scrolling = false;
    $: hideNavbar = `transition-all duration-1000 ${
		scrolling ? "-translate-y-full" : "translate-y-0"
	}`;
    afterUpdate(() => {
		if (newY > oldY) {
            scrolling = true;
        } else {
            scrolling = false;
        }
        oldY = newY;
	});
</script>

{#if $page.data.session}
    <div class="nav flex items-center {hideNavbar}">
        <a href="/">
            <div class="w-20 flex flex-row">
                <img src="HeaderLogoSmall.png" alt="trophy" />
                <h1>FF</h1>
            </div>
        </a>
        <div class="w-full flex flex-row justify-end">
            <div class="space-y-2 tablet:hidden">
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
            </div>
            <div class="hidden tablet:flex">
                <a href="/"> <h5 class="navbtn"> Sesong </h5> </a>     
                <a href="/fantasy"> <h5 class="navbtn"> Mitt lag </h5> </a>
                {#if isAdmin}
                    <a href="/admin"> <h5 class="navbtn"> Admin </h5> </a>
                {/if}
                <a href="/profile"> <h5 class="navbtn"> Profil </h5> </a>
            </div>
        </div>
    </div>
{:else}
    <div class="nav flex items-center {hideNavbar}">
        <a href="/">
            <div class="w-20 flex flex-row">
                <img src="HeaderLogoSmall.png" alt="trophy" />
                <h1>FF</h1>
            </div>
        </a>
        <div class="w-full flex flex-row justify-end">
            <div class="space-y-2 tablet:hidden">
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
                <div class="w-8 h-0.5 bg-secondary-color-light"></div>
            </div>
            <div class="hidden tablet:flex">
                <a href="/"> <h5 class="navbtn"> Hjem </h5> </a>      
                <a href="/login"> <h5 class="navbtn"> Logg inn </h5> </a>
                <a href="/register"> <h5 class="navbtn"> Registrer deg </h5> </a>
            </div>
        </div>
    </div>
{/if}


<!-- Applies afterUpdate since y updates on scrolling -->
<svelte:window bind:scrollY={newY} />