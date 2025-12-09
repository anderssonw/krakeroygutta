<script lang="ts">
	interface Props {
		src?: string | null;
		alt?: string | null;
		size?: 'sm' | 'md' | 'lg';
	}

	let { src, alt, size = 'md' }: Props = $props();

	const sizeClasses = {
		sm: 'h-8 w-8 min-w-8',
		md: 'h-10 w-10 min-w-10',
		lg: 'h-12 w-12 min-w-12'
	};
</script>

{#if src}
	<img {src} alt={alt || 'Player'} class="aspect-square rounded-full object-cover {sizeClasses[size]}" />
{/if}
