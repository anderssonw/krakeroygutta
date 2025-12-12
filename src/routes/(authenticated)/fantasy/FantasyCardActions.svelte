<script lang="ts">
	import DeleteIcon from '~icons/material-symbols/delete-outline';
	import CaptainIcon from '~icons/material-symbols/panorama-photosphere';
	import NotCaptainIcon from '~icons/material-symbols/panorama-photosphere-outline';
	import SelectIcon from '~icons/majesticons/open';

	type Props = {
		isCaptain?: boolean;
		hidden?: boolean;
		onDelete?: () => void;
		onToggleCaptain?: () => void;
		onSelect?: () => void;
	};

	let { isCaptain = false, hidden = false, onDelete, onToggleCaptain, onSelect }: Props = $props();
</script>

<div class="flex gap-3" class:opacity-0={hidden} class:pointer-events-none={hidden} aria-hidden={hidden}>
	<button
		class="rounded-md border border-black bg-accent-foreground p-2 text-accent hover:bg-accent"
		onclick={onDelete}
		disabled={!onDelete || hidden}
	>
		<DeleteIcon class="h-6 w-6" />
	</button>
	<button
		class="rounded-md border border-black bg-accent-foreground p-2 text-accent hover:bg-accent"
		onclick={onToggleCaptain}
		disabled={!onToggleCaptain || hidden}
	>
		{#if isCaptain}
			<CaptainIcon class="h-6 w-6" />
		{:else}
			<NotCaptainIcon class="h-6 w-6" />
		{/if}
	</button>
	<button
		class="rounded-md border border-black bg-accent-foreground p-2 text-accent hover:bg-accent"
		onclick={onSelect}
		disabled={!onSelect || hidden}
	>
		<SelectIcon class="h-6 w-6" />
	</button>
</div>
