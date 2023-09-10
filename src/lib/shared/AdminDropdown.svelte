<script lang="ts">
    export let title: string;
    export let showContent: boolean;
</script>

<div class="flex flex-row items-center space-x-4">
    <h3> Administrer {title} </h3>
    <div class="hover:cursor-pointer" on:mouseup={() => showContent = !showContent }>
        {#if showContent}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
        {/if}
    </div>
</div>