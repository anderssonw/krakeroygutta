<script lang="ts">
	import type { PageProps } from './$types';
	import MadsSpeechBubble from '$lib/components/MadsSpeechBubble.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import betLogo from '$lib/assets/bets/bet_logo.png';
	import { isSeasonPastDeadline } from '$lib/season';
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';
	import Spinner from '$lib/components/Spinner.svelte';

	let { data }: PageProps = $props();

	let isSubmitting = $state(false);

	const userHasBet = $derived(() => {
		if (!data.profile || !data.bets) return false;
		return data.bets.some((bet) => bet.better?.id === data.profile.id);
	});

	const userHasPlacedBet = (bet: (typeof data.bets)[0]) => {
		if (!data.profile) return false;
		return bet.challengers.some((c) => c.id === data.profile.id);
	};
</script>

<div class="flex flex-col gap-8 p-4 md:p-8">
	<h1 class="text-center text-4xl font-bold">Veddemål</h1>

	<MadsSpeechBubble madsVersion="pirate">
		<div class="flex flex-col gap-2">
			<span>Her kan hver bruker legge ut 1 veddemål relatert til årets sesong.</span>

			<span>De andre brukerne kan velge å vedde imot, og valget låses dagen fantasy sesongen starter.</span>

			<span>Betalingen skjer 1-til-1 og er bundet av kjærlighet til hverandre.</span>
		</div>
	</MadsSpeechBubble>

	{#if !userHasBet() && !isSeasonPastDeadline(data.season)}
		<Card class="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Opprett ett veddemål</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					method="POST"
					action="?/createBet"
					class="flex flex-col gap-4"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;
							if (result.type === 'success') {
								toasts.add('Veddemål opprettet!', 'success');
							} else {
								toasts.add('Noe gikk galt ved opprettelse av veddemål.', 'error');
							}
							await update();
						};
					}}
				>
					<div class="flex flex-col gap-2">
						<Label for="bet">Veddemål</Label>
						<Input id="bet" name="bet" type="text" placeholder="Jeg vedder at..." required disabled={isSubmitting} />
					</div>
					<div class="flex flex-col gap-2">
						<Label for="value">Sats (kr)</Label>
						<Input id="value" name="value" type="number" min="1" placeholder="50" required disabled={isSubmitting} />
					</div>
					<Button type="submit" class="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
						{#if isSubmitting}
							<span class="flex justify-center">
								<Spinner size="md" />
							</span>
						{:else}
							Send inn
						{/if}
					</Button>
				</form>
			</CardContent>
		</Card>
	{/if}

	<div class="flex flex-col gap-4">
		{#if isSeasonPastDeadline(data.season)}
			<p class="text-center text-sm font-semibold text-destructive">Fristen for å opprette eller utfordre veddemål har gått ut.</p>
		{/if}
		<h2 class="text-center text-2xl font-bold">Eksisterende veddemål</h2>

		{#if data.bets.length === 0}
			<p class="text-center text-muted-foreground">Ingen veddemål opprettet ennå</p>
		{:else}
			<div class="grid grid-cols-1 place-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.bets as bet}
					<div class="flex w-full max-w-sm flex-col bg-white p-6 text-black shadow-2xl">
						<div class="mb-8 flex flex-col items-center">
							<enhanced:img class="w-[40%]" src={betLogo} alt="bet_logo" />
							<p class="text-xs text-muted-foreground">Stolt sponsor av Fantasy Futsal</p>
						</div>

						<div class="border-b-2 border-primary p-4">
							<p class="text-center">{bet.bet}</p>
						</div>

						<div class="flex justify-between border-b-2 border-primary p-4">
							<p>Sats</p>
							<p class="font-bold">{bet.value} kr</p>
						</div>

						<div class="grid grid-cols-2 gap-4 py-4">
							<div class="flex flex-col justify-end">
								<div class="border-b-2 border-primary">
									<p class="text-center italic">{bet.better.name}</p>
								</div>
								<p class="text-center text-sm font-bold">Eier</p>
							</div>
							<div class="flex flex-col justify-end">
								<div class="border-b-2 border-primary">
									{#if bet.challengers.length === 0}
										<p class="text-center text-sm text-muted-foreground italic">Ingen</p>
									{:else}
										{#each bet.challengers as challenger}
											<p class="text-center italic">{challenger.name}</p>
										{/each}
									{/if}
								</div>
								<p class="text-center text-sm font-bold">Byder</p>
							</div>
						</div>

						<!-- Action Button -->
						{#if !isSeasonPastDeadline(data.season)}
							<form
								method="POST"
								class="flex justify-center"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ result, update }) => {
										isSubmitting = false;
										if (result.type === 'success') {
											toasts.add((result.data?.message as string) || 'Handling fullført!', 'success');
										} else {
											toasts.add('Noe gikk galt.', 'error');
										}
										await update();
									};
								}}
							>
								<input type="hidden" name="bet_id" value={bet.id} />

								{#if bet.better.id === data.profile.id}
									<Button
										type="submit"
										formaction="?/removeBet"
										variant="destructive"
										class="w-full bg-red-600 text-white hover:bg-red-700"
										disabled={isSubmitting}
									>
										{#if isSubmitting}
											<Spinner size="sm" />
										{:else}
											Fjern veddemål
										{/if}
									</Button>
								{:else if userHasPlacedBet(bet)}
									<Button
										type="submit"
										formaction="?/removeBetAgainst"
										variant="destructive"
										class="w-full  bg-red-600 text-white hover:bg-red-700"
										disabled={isSubmitting}
									>
										{#if isSubmitting}
											<Spinner size="sm" />
										{:else}
											Fjern utfordring
										{/if}
									</Button>
								{:else}
									<Button
										type="submit"
										formaction="?/addBetAgainst"
										variant="default"
										class="w-full bg-green-600 text-white hover:bg-green-700"
										disabled={isSubmitting}
									>
										{#if isSubmitting}
											<Spinner size="sm" />
										{:else}
											Utfordre
										{/if}
									</Button>
								{/if}
							</form>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
