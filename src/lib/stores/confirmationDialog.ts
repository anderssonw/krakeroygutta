import { writable } from 'svelte/store';

export type ConfirmationDialogOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'default' | 'destructive';
};

type ConfirmationDialog = {
	id: string;
	options: ConfirmationDialogOptions;
	resolve: (confirmed: boolean) => void;
};

function createConfirmationDialogStore() {
	const { subscribe, update } = writable<ConfirmationDialog[]>([]);

	return {
		subscribe,
		confirm: (options: ConfirmationDialogOptions = {}): Promise<boolean> => {
			return new Promise((resolve) => {
				const id = crypto.randomUUID();
				const dialog: ConfirmationDialog = { id, options, resolve };

				update((dialogs) => [...dialogs, dialog]);
			});
		},
		respond: (id: string, confirmed: boolean) => {
			update((dialogs) => {
				const dialog = dialogs.find((d) => d.id === id);
				if (dialog) {
					dialog.resolve(confirmed);
					return dialogs.filter((d) => d.id !== id);
				}
				return dialogs;
			});
		},
		clear: () => {
			update(() => []);
		}
	};
}

export const confirmationDialog = createConfirmationDialogStore();
