<script lang="ts">
	import DeleteIcon from '~icons/material-symbols/delete-outline';
	import CaptainIcon from '~icons/material-symbols/panorama-photosphere';
	import NotCaptainIcon from '~icons/material-symbols/panorama-photosphere-outline';
	import SelectIcon from '~icons/majesticons/open';
	import { Button } from '$lib/components/ui/button';

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
	<Button onclick={onToggleCaptain} disabled={!onToggleCaptain || hidden} size="icon">
		{#if isCaptain}
			<CaptainIcon class="h-6 w-6" />
		{:else}
			<NotCaptainIcon class="h-6 w-6" />
		{/if}
	</Button>
	<Button onclick={onSelect} disabled={!onSelect || hidden} size="icon">
		<SelectIcon class="h-6 w-6" />
	</Button>
	<Button onclick={onDelete} disabled={!onDelete || hidden} variant="destructive" size="icon">
		<DeleteIcon class="h-6 w-6" />
	</Button>
</div>
