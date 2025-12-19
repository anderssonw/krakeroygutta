<script lang="ts">
	import clsx from 'clsx';
	import Spinner from '~icons/nrk/spinner';

	type Props = {
		size: 'sm' | 'md' | 'lg';
		class?: string;
	};

	const { class: className, size }: Props = $props();

	const sizeClasses = $derived(() => {
		switch (size) {
			case 'sm':
				return 'h-4 w-4';
			case 'md':
				return 'h-6 w-6';
			case 'lg':
				return 'h-8 w-8';
			default:
				return 'h-6 w-6';
		}
	});
</script>

<Spinner class={clsx(`animate-spin text-primary-foreground `, sizeClasses(), className)} />
