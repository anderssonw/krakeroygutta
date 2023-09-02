<script lang="ts">
	export let imageSrc: string;
	export let text: string | string[];
	export let mirror: boolean | undefined = undefined;

	$: paragraphs = generateParagraphs();

	const generateParagraphs = (): string[] => {
		if (typeof text === 'string') {
			return [text];
		}

		return text;
	};

	const translateDirection = mirror ? 'translate-x-12 flex-row-reverse justify-items-end' : '-translate-x-12';
	const mirroredTriangle = mirror ? '-scale-x-100' : '';
</script>

<div class="w-[70%] tablet:max-w-[50ch]">
	<div class="bg-secondary-color-light rounded-3xl grid p-8 gap-2">
		{#each paragraphs as paragraph}
			<p class="text-primary-color-dark">{paragraph}</p>
		{/each}
	</div>
	<div class={`flex ${translateDirection}`}>
		<img class="-translate-y-6 max-w-[150px] justify-" src={imageSrc} alt="En spelare" />
		<div class={`speech-triangle bg-secondary-color-light h-12 w-12  ${mirroredTriangle}`} />
	</div>
</div>

<style>
	.speech-triangle {
		clip-path: polygon(50% 0%, 0 60%, 99% 0);
	}
</style>
