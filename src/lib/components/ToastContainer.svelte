<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import Toast from './Toast.svelte';
</script>

<div class="pointer-events-none fixed top-0 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center p-4">
	{#each $toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</div>
