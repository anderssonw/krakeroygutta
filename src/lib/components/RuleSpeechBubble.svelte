<script lang="ts">
	export let imageSrc: string;
	export let text: string | string[];

	$: paragraphs = generateParagraphs();

	const generateParagraphs = (): string[] => {
		if (typeof text === 'string') {
			return [text];
		}

		return text;
	};
</script>

<div class="max-w-[50ch]">
	<div class="bg-slate-100 rounded-3xl grid p-8 gap-2">
		{#each paragraphs as paragraph}
			<p class="text-primary-color-dark">{paragraph}</p>
		{/each}
	</div>
	<div class="flex -translate-x-12">
		<img class="-translate-y-6 max-w-[150px]" src={imageSrc} alt="En spelare" />
		<div class="speech-triangle bg-slate-100 h-12 w-12" />
	</div>
</div>

<style>
	.speech-triangle {
		clip-path: polygon(50% 0%, 0 60%, 99% 0);
	}
</style>
