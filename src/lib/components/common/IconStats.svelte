<script lang="ts">
    export let amount: number;
    export let large: boolean;
    export let icon: string;
</script>

<div class="flex flex-row items-center justify-center">
    <img class={large ? 'w-16' : 'w-8'} src="/stat_icons/{icon}_icon.png" alt="goal" />
    <div class={large ? 'text-5xl' : 'text-2xl'}>{amount}</div>
</div>