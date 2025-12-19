<script lang="ts">
	import { onMount } from 'svelte';
	import { cards, KrakeroyHolographic, type KrakeroyStarterPack } from './page';
	import 'animate.css';

	let starterPack: HTMLElement;
	let cardRow: HTMLElement;
	let card1: HTMLElement;
	let card2: HTMLElement;
	let card3: HTMLElement;
	let card4: HTMLElement;

	function getRandomElements(arr: KrakeroyStarterPack[], count: number) {
		// Shuffle the array using the Fisher-Yates algorithm
		let shuffled = arr.slice(); // Create a copy of the array
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		// Return the first `count` elements from the shuffled array
		return shuffled.slice(0, count);
	}

	$: randomCards = getRandomElements(cards, 4);

	onMount(() => {
		if (starterPack && cardRow && card1 && card2 && card3 && card4) {
			starterPack.addEventListener('click', () => {
				starterPack.classList.add('animate__animated', 'animate__zoomOut', 'animate__delay-1s', 'animate__slow');
			});
			starterPack.addEventListener('animationend', () => {
				starterPack.classList.add('hidden');
				cardRow.classList.remove('hidden');
				cardRow.classList.add('block', 'animate__animated', 'animate__backInLeft');
			});
			card1.addEventListener('mousemove', (event) => {
				const mouseX = event.offsetX;
				const mouseY = event.offsetY;
				const width = card1.clientWidth;
				const height = card1.clientHeight;
				const percentX = Math.round((mouseX / width) * 100);
				const percentY = Math.round((mouseY / height) * 100);
				card1.style.backgroundPosition = `${percentX}% ${percentY}%`;
			});
			card2.addEventListener('mousemove', (event) => {
				const mouseX = event.offsetX;
				const mouseY = event.offsetY;
				const width = card2.clientWidth;
				const height = card2.clientHeight;
				const percentX = Math.round((mouseX / width) * 100);
				const percentY = Math.round((mouseY / height) * 100);
				card2.style.backgroundPosition = `${percentX}% ${percentY}%`;
			});
			card3.addEventListener('mousemove', (event) => {
				const mouseX = event.offsetX;
				const mouseY = event.offsetY;
				const width = card3.clientWidth;
				const height = card3.clientHeight;
				const percentX = Math.round((mouseX / width) * 100);
				const percentY = Math.round((mouseY / height) * 100);
				card3.style.backgroundPosition = `${percentX}% ${percentY}%`;
			});
			card4.addEventListener('mousemove', (event) => {
				const mouseX = event.offsetX;
				const mouseY = event.offsetY;
				const width = card4.clientWidth;
				const height = card4.clientHeight;
				const percentX = Math.round((mouseX / width) * 100);
				const percentY = Math.round((mouseY / height) * 100);
				card4.style.backgroundPosition = `${percentX}% ${percentY}%`;
			});
		}
	});
</script>

<div class="structure">
	<button class="btn-hollow" on:click={() => location.reload()}> Ny pakke </button>

	<div bind:this={starterPack}>
		<div
			class="w-60 h-80 rounded cursor-pointer bg-secondary-color-light hover:bg-secondary-color active:bg-secondary-color-dark active:scale-[98%] grid items-center justify-center"
		>
			<div class="flex flex-col items-center text-primary-color-dark">
				<div class="text-lg">Kråkerøygutta</div>
				<div class="text-lg">Starter pack</div>
			</div>
		</div>
	</div>

	<div bind:this={cardRow} class="flex flex-row flex-wrap align-center gap-4 hidden">
		<div class="relative w-40 h-52 bg-primary-color-light rounded-lg hover:scale-[102%] border-4 border-tertiary-color-dark">
			<div class="bg-secondary-color w-[100%] rounded-t">
				<img class="rounded-t" src={randomCards[0].image} alt={randomCards[0].title} />
			</div>
			<div class="flex flex-col items-center">
				<div class="text-sm">{randomCards[0].title}</div>
			</div>
			<div bind:this={card1} class={randomCards[0].holo === KrakeroyHolographic.Holo ? `holo-button` : ''} />
		</div>

		<div class="relative w-40 h-52 bg-primary-color-light rounded-lg hover:scale-[102%] border-4 border-tertiary-color-dark">
			<div class="bg-secondary-color w-[100%] rounded-t">
				<img class="rounded-t" src={randomCards[1].image} alt={randomCards[1].title} />
			</div>
			<div class="flex flex-col items-center">
				<div class="text-sm">{randomCards[1].title}</div>
			</div>
			<div bind:this={card2} class={randomCards[1].holo === KrakeroyHolographic.Holo ? `holo-button` : ''} />
		</div>

		<div class="relative w-40 h-52 bg-primary-color-light rounded-lg hover:scale-[102%] border-4 border-tertiary-color-dark">
			<div class="bg-secondary-color w-[100%] rounded-t">
				<img class="rounded-t" src={randomCards[2].image} alt={randomCards[2].title} />
			</div>
			<div class="flex flex-col items-center">
				<div class="text-sm">{randomCards[2].title}</div>
			</div>
			<div bind:this={card3} class={randomCards[2].holo === KrakeroyHolographic.Holo ? `holo-button` : ''} />
		</div>

		<div class="relative w-40 h-52 bg-primary-color-light rounded-lg hover:scale-[102%] border-4 border-tertiary-color-dark">
			<div class="bg-secondary-color w-[100%] rounded-t">
				<img class="rounded-t" src={randomCards[3].image} alt={randomCards[3].title} />
			</div>
			<div class="flex flex-col items-center">
				<div class="text-sm">{randomCards[3].title}</div>
			</div>
			<div bind:this={card4} class={randomCards[3].holo === KrakeroyHolographic.Holo ? `holo-button` : ''} />
		</div>
	</div>
</div>

<style>
	.holo-button {
		background: linear-gradient(90deg, #e81416, #ffa500, #faeb36, #79c314, #487de7, #4b369d, #70369d);
		background-size: 200% 200%;
		/* animation: moveGradient 4s ease infinite; */
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 15%;
	}
</style>
