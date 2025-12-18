<script lang="ts">
	import type { PageProps } from './$types';
	import { Card, CardContent } from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import IconPlus from '~icons/lucide/plus';
	import MatchCard from '$lib/components/MatchCard.svelte';
	import { page } from '$app/state';
	import { toasts } from '$lib/stores/toast';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();

	let { matches, teams } = $derived(data);

	let dialogOpen = $state(false);
	let homeTeamId = $state<string | undefined>(undefined);
	let awayTeamId = $state<string | undefined>(undefined);

	$effect(() => {
		if (!dialogOpen) {
			homeTeamId = undefined;
			awayTeamId = undefined;
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Kamper</h1>
				<p class="mt-2 text-muted-foreground">Oversikt over alle kamper i sesongen</p>
			</div>
			<Button onclick={() => (dialogOpen = true)}>
				<IconPlus class="mr-2 h-4 w-4" />
				Ny kamp
			</Button>
		</div>
	</div>

	{#if matches.length === 0}
		<Card>
			<CardContent class="py-12 text-center">
				<p class="text-muted-foreground">Ingen kamper funnet for denne sesongen.</p>
			</CardContent>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each matches as match, index (match.id)}
				<MatchCard {match} matchNumber={matches.length - index} isAdmin={true} />
			{/each}
		</div>
	{/if}
</div>

<!-- New Match Dialog -->
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Opprett ny kamp</Dialog.Title>
			<Dialog.Description>Velg hjemmelag og bortelag for den nye kampen.</Dialog.Description>
		</Dialog.Header>
		<form
			action="?/createMatch"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type == 'success') {
						toasts.add('Kamp opprettet!', 'success');
					} else {
						toasts.add('Noe gikk galt ved opprettelse av kamp.', 'error');
					}
					dialogOpen = false;
					update();
				};
			}}
		>
			<input type="hidden" name="seasonId" value={page.url.searchParams.get('seasonId')} />
			<div class="grid grid-cols-[1fr_1fr] gap-4 py-4">
				{#snippet teamSelect(fieldName: string, id: string, label: string, selectedValue: string | undefined, onchange: (v: string | undefined) => void)}
					<div class="grid gap-2">
						<Label for={id}>{label}</Label>
						<Select.Root type="single" name={fieldName} value={selectedValue} onValueChange={onchange}>
							<Select.Trigger class="w-full" {id}>
								{teams.find((team) => team.id.toString() === selectedValue)?.name ?? 'Velg lag'}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Lag</Select.Label>
									{#each teams.filter((team) => team.id.toString() !== homeTeamId && team.id.toString() !== awayTeamId) as team (team.id)}
										<Select.Item value={team.id.toString()} label={team.name}>
											<div class="flex items-center gap-2">
												<div class="h-3 w-3 rounded-full" style="background-color: {team.color};"></div>
												{team.name}
											</div>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				{/snippet}

				{@render teamSelect('homeTeamId', 'home-team', 'Hjemmelag', homeTeamId, (v) => (homeTeamId = v))}
				{@render teamSelect('awayTeamId', 'away-team', 'Bortelag', awayTeamId, (v) => (awayTeamId = v))}
			</div>
			<Dialog.Footer>
				<Button variant="outline" onclick={() => (dialogOpen = false)}>Avbryt</Button>
				<Button type="submit" disabled={!homeTeamId || !awayTeamId}>Opprett kamp</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
