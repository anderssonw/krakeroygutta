import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info';

export type Toast = {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
};

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'info', duration: number = 3000) => {
			const id = crypto.randomUUID();
			const toast: Toast = { id, message, type, duration };

			update((toasts) => [...toasts, toast]);

			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}

			return id;
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		clear: () => {
			update(() => []);
		}
	};
}

export const toasts = createToastStore();
