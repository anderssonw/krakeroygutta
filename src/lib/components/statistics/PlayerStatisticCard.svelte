<script lang="ts">
	export let imgSrc: string | undefined;
	export let imgAlt: string | undefined;

	export let playerName: string | undefined;
	export let playerSubtitle: string | undefined;

	export let position: number | undefined = undefined;

	const getColourFromPosition = (position: number) => {
		switch (position) {
			case 1:
				return 'bg-yellow-500 border-t-yellow-200 border-b-yellow-800';
			case 2:
				return 'bg-stone-500 border-t-stone-200 border-b-stone-700';
			case 3:
				return 'bg-amber-600 border-t-amber-200 border-b-amber-800';
			default:
				return 'bg-zinc-700 border-t-zinc-400 border-b-zinc-800';
		}
	};
</script>

<div class="flex flex-row justify-between bg-team-black">
	<div class="flex flex-row items-center">
		<img class="bg-white rounded-full p-2 mx-4 my-2 w-12 h-12" src={imgSrc} alt={imgAlt} />
		<div class="mr-4">
			<p class="font-bold text-sm">{playerName}</p>
			<p class="font-light text-xs">{playerSubtitle}</p>
		</div>
	</div>
	{#if position}
		<div class={`flex flex-col content-center justify-center px-4 ml-4 w-16 border-y-4 ${getColourFromPosition(position)}`}>
			<p class="text-primary-color-dark text-center text-3xl italic font-bold">{position}</p>
		</div>
	{/if}
</div>
