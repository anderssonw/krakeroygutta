<script lang="ts">
    import { page } from '$app/stores';

    export let isAdmin: boolean;
</script>

{#if $page.data.session}
    <div class="bg-gradient-to-b from-black/75 h-20 tablet:h-24 laptop:h-28 flex justify-around items-center sticky top-0 z-50">
        <div class="w-80 flex justify-around items-center">
            <a href="/"> <h4> Sesong </h4> </a>
            <a href="/fantasy"> <h4> Mitt lag </h4> </a>
        </div>
        <div class="w-24">
            <a href="/">
                <img src="HeaderLogoSmall.png" alt="logo" />
            </a>
        </div>
        <div class="w-80 flex justify-around items-center">
            {#if isAdmin}
                <a href="/admin"> <h4> Admin </h4> </a>
            {/if}
            <a href="/profile"> <h4> Profil </h4> </a>
        </div>
    </div>
{:else}
    <div class="bg-gradient-to-b from-black/75 h-20 tablet:h-24 laptop:h-28 flex justify-around tablet:justify-end items-center px-8 sm:px-20">
        <a href="/"> <h4> Hjem </h4> </a>
        <a href="/register"> <h4> Registrer deg </h4> </a>
        <a href="/login"> <h4> Logg inn </h4> </a>
    </div>
{/if}
