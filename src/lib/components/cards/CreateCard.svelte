<script lang="ts">
	import { CARD_SIZE, calculatePlayerStatAverage, getPlayerCardType } from '$lib/shared/playerCardFunctions';
	import type { FullPlayer, StandardPlayer } from '$lib/types/newTypes';
	import TextField from '../common/TextField.svelte';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import currencyImg from '$lib/assets/currency.png';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let player: StandardPlayer;
	export let seasonId: number;
	export let currentCard: FullPlayer | null;
	export let previousCard: FullPlayer | null;
	export let card_size: CARD_SIZE;

	$: playerStatAverage = calculatePlayerStatAverage(currentCard);
	$: cardType = getPlayerCardType(currentCard, true);
	$: cardSizing = getCardSizing();

	const getCardSizing = () => {
		let sizes = {
			width: sizeBasedReturn('w-60', 'w-40', 'w-33'),
			height: sizeBasedReturn('h-96', 'h-64', 'h-52'),
			avg_stats: sizeBasedReturn('text-6xl', 'text-4xl', 'text-3xl'),
			name: sizeBasedReturn('text-3xl', 'text-xl', 'text-base'),
			stats_text: sizeBasedReturn('text-xl', 'text-base', 'text-xl'),
			stats_value: sizeBasedReturn('text-2xl', 'text-lg', 'text-sm'),
			stat_gap_y: sizeBasedReturn('space-y-[7%]', 'space-y-[5%]', 'space-y-[4%]'),
			stat_gap_x: sizeBasedReturn('gap-x-4', 'gap-x-1.5', 'gap-x-1'),
			header_gap_y: sizeBasedReturn('gap-y-6', 'gap-y-3', 'gap-y-2'),
			currency_size: sizeBasedReturn('w-4', 'w-3', 'w-2'),
			currency_space_y: sizeBasedReturn('pt-3', 'pt-0.5', 'pt-0.5'),
			image_width: sizeBasedReturn(120, 100, 80)
		};
		return sizes;
	};
	const sizeBasedReturn = (large_opt: any, medium_opt: any, small_opt: any) => {
		if (card_size == CARD_SIZE.LARGE) return large_opt;
		if (card_size == CARD_SIZE.MEDIUM) return medium_opt;
		return small_opt;
	};
	const getLastName = (player: FullPlayer) => {
		const lastName = player.name.split(' ')[1];
		return lastName.split('-')[0];
	};

	let widthDiff = 0;
	const handleImageLoad = (target: any) => {
		if (target) {
			const heightToWidthRatio = target.naturalHeight / target.naturalWidth;
			const changeBy = (1 - heightToWidthRatio) * 100;
			const changeByClamped = Math.min(Math.max(changeBy, -20), 20);
			widthDiff = changeByClamped;
		}
	};

	let imgEl: HTMLImageElement;
	onMount(() => {
		if (imgEl && imgEl.complete) {
			handleImageLoad(imgEl);
		}
	});
</script>

<form method="POST" use:enhance>
	<input type="hidden" name="player_id" bind:value={player.id} />
	<input type="hidden" name="season_id" bind:value={seasonId} />
	{#if currentCard}
		<div class="flex flex-col gap-2 items-center">
			<div class="flex flex-row gap-4">
				<div
					class="{cardType} {cardSizing.width} {cardSizing.height} {currentCard.inform_image
						? 'text-tertiary-color'
						: 'text-primary-color'}"
				>
					<div class="relative w-full h-[53.2%]">
						<div
							style={`width: ${cardSizing.image_width + widthDiff}px;`}
							class="right-[5%] absolute {card_size === CARD_SIZE.SMALL ? 'bottom-[1px]' : 'bottom-0'} flex flex-col items-center"
						>
							<img
								bind:this={imgEl}
								src={currentCard.inform_image ? currentCard.inform_image : currentCard.image}
								alt="head"
								on:load={(e) => handleImageLoad(e.target)}
							/>
						</div>

						<div class="absolute top-[20%] left-[10%] w-[25%] flex flex-col items-center {cardSizing.header_gap_y}">
							<div class="{cardSizing.avg_stats} font-stats">{playerStatAverage}</div>
						</div>
					</div>

					<div class="relative w-full h-[46.8%]">
						<div class="w-full flex flex-col items-center {cardSizing.stat_gap_y}">
							<div class="{cardSizing.name} font-semibold">{getLastName(currentCard)}</div>

							<div class="grid grid-cols-5 {cardSizing.stat_gap_x}">
								<div class="flex flex-col items-center">
									<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">ANG</div>
									<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">
										<input
											class="w-5 bg-transparent outline-none border-b text-center text-base leading-none {currentCard.inform_image
												? 'text-tertiary-color border-tertiary-color'
												: 'text-primary-color border-primary-color'}"
											type="number"
											name="attack"
											bind:value={currentCard.attack}
										/>
									</div>
								</div>
								<div class="flex flex-col items-center">
									<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">FOR</div>
									<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">
										<input
											class="w-5 bg-transparent outline-none border-b text-center text-base leading-none {currentCard.inform_image
												? 'text-tertiary-color border-tertiary-color'
												: 'text-primary-color border-primary-color'}"
											type="number"
											name="defence"
											bind:value={currentCard.defence}
										/>
									</div>
								</div>
								<div class="flex flex-col items-center">
									<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">TEK</div>
									<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">
										<input
											class="w-5 bg-transparent outline-none border-b text-center text-base leading-none {currentCard.inform_image
												? 'text-tertiary-color border-tertiary-color'
												: 'text-primary-color border-primary-color'}"
											type="number"
											name="skill"
											bind:value={currentCard.skill}
										/>
									</div>
								</div>
								<div class="flex flex-col items-center">
									<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">MOR</div>
									<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">
										<input
											class="w-5 bg-transparent outline-none border-b text-center text-base leading-none {currentCard.inform_image
												? 'text-tertiary-color border-tertiary-color'
												: 'text-primary-color border-primary-color'}"
											type="number"
											name="morale"
											bind:value={currentCard.morale}
										/>
									</div>
								</div>
								<div class="flex flex-col items-center">
									<div class="leading-none tracking-[-.1em] font-slim {cardSizing.stats_value}">FYS</div>
									<div class="font-semibold leading-none tracking-[-.05em] font-stats {cardSizing.stats_value}">
										<input
											class="w-5 bg-transparent outline-none border-b text-center text-base leading-none {currentCard.inform_image
												? 'text-tertiary-color border-tertiary-color'
												: 'text-primary-color border-primary-color'}"
											type="number"
											name="physical"
											bind:value={currentCard.physical}
										/>
									</div>
								</div>
							</div>
						</div>

						<div class="flex flex-row items-center justify-center space-x-1 font-semibold {cardSizing.currency_space_y}">
							<input
								class="w-10 bg-transparent outline-none text-center text-base leading-none {currentCard.inform_image
									? 'text-tertiary-color border-tertiary-color'
									: 'text-primary-color border-primary-color'}"
								type="number"
								name="price"
								bind:value={currentCard.price}
							/>
							<div class={cardSizing.currency_size}>
								<img src={currencyImg} alt="currency" />
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-between">
					<div class="flex flex-col gap-2">
						<TextField
							header="Inform"
							label="inform_image"
							type="text"
							placeholder="https://i.imgur.com/"
							bind:value={currentCard.inform_image}
							required={false}
						/>
					</div>

					<div class="flex flex-row gap-2">
						<div class="flex-1">
							<button type="submit" class="btn bg-green-500 w-full" formaction="?/update"> Lagre </button>
						</div>
						<button type="submit" class="btn bg-red-500" formaction="?/delete"><DeleteIcon /></button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-row">
			{#if previousCard}
				<input type="hidden" name="attack" bind:value={previousCard.attack} />
				<input type="hidden" name="defence" bind:value={previousCard.defence} />
				<input type="hidden" name="skill" bind:value={previousCard.skill} />
				<input type="hidden" name="morale" bind:value={previousCard.morale} />
				<input type="hidden" name="physical" bind:value={previousCard.physical} />
				<input type="hidden" name="price" bind:value={previousCard.price} />
			{:else}
				<input type="hidden" name="attack" value={50} />
				<input type="hidden" name="defence" value={50} />
				<input type="hidden" name="skill" value={50} />
				<input type="hidden" name="morale" value={50} />
				<input type="hidden" name="physical" value={50} />
				<input type="hidden" name="price" value={5000} />
			{/if}

			<button type="submit" formaction="?/create">
				<div class="clickable-card {cardType} {cardSizing.width} {cardSizing.height}" />
			</button>
		</div>
	{/if}
</form>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
