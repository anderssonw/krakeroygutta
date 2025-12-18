<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { confirmationDialog, type ConfirmationDialogOptions } from '$lib/stores/confirmationDialog';

	interface Props {
		id: string;
		options: ConfirmationDialogOptions;
	}

	let { id, options }: Props = $props();

	let open = $state(true);

	function handleConfirm() {
		confirmationDialog.respond(id, true);
	}

	function handleCancel() {
		confirmationDialog.respond(id, false);
	}

	let title = $derived(options.title ?? 'Er du sikker?');
	let description = $derived(options.description ?? 'Denne handlingen kan ikke angres.');
	let confirmText = $derived(options.confirmText ?? 'Bekreft');
	let cancelText = $derived(options.cancelText ?? 'Avbryt');
	let variant = $derived(options.variant ?? 'destructive');
</script>

<Dialog.Root {open}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="gap-2 sm:gap-2">
			<Button variant="outline" onclick={handleCancel}>
				{cancelText}
			</Button>
			<Button {variant} onclick={handleConfirm}>
				{confirmText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
