<script lang="ts">
	import type { Toast } from '$lib/stores/toast';
	import { toasts } from '$lib/stores/toast';
	import { fade, fly } from 'svelte/transition';
	import IconCheckCircle from '~icons/lucide/check-circle';
	import IconXCircle from '~icons/lucide/x-circle';
	import IconInfoCircle from '~icons/lucide/info';
	import IconX from '~icons/lucide/x';

	let { toast }: { toast: Toast } = $props();

	const typeStyles = {
		success: 'bg-green-600 text-white',
		error: 'bg-red-600 text-white',
		info: 'bg-blue-600 text-white'
	};

	const typeIcons = {
		success: IconCheckCircle,
		error: IconXCircle,
		info: IconInfoCircle
	};

	const IconComponent = $derived(typeIcons[toast.type]);

	function handleClose() {
		toasts.remove(toast.id);
	}
</script>

<div
	in:fly={{ y: -50, duration: 300 }}
	out:fade={{ duration: 200 }}
	class="pointer-events-auto mb-3 flex max-w-md min-w-[300px] items-center justify-between gap-3 rounded-lg px-4 py-3 shadow-lg {typeStyles[
		toast.type
	]}"
	role="alert"
>
	<div class="flex items-center gap-3">
		<IconComponent class="h-5 w-5" />
		<p class="text-sm font-medium">{toast.message}</p>
	</div>
	<button
		onclick={handleClose}
		class="ml-2 rounded-md p-1 hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
		aria-label="Close"
	>
		<IconX class="h-4 w-4" />
	</button>
</div>
