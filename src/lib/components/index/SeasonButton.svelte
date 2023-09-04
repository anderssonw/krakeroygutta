<script lang="ts">
    import { goto } from '$app/navigation';

    export let image: string;
    export let route: string;
</script>

<div 
    class="flex flex-col items-center group 
    hover:cursor-pointer hover:scale-105 active:scale-100 border-4 border-secondary-color-light rounded-3xl" on:mouseup={() => goto(`/${route.toLowerCase()}`)}>

    <img src="/index/{image}" alt="players" class="w-[80%] mb-2 group-hover:scale-105 group-active:scale-100" />
    <h1 class="mb-4 group-hover:scale-105 group-active:scale-100">{route}</h1>
</div>