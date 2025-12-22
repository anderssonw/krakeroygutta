<script lang="ts">
	import type { PageProps } from './$types';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import IconEdit from '~icons/lucide/pencil';
	import IconDelete from '~icons/lucide/trash-2';
	import IconSave from '~icons/lucide/save';
	import IconX from '~icons/lucide/x';
	import { cn } from '$lib/utils';
	import { toasts } from '$lib/stores/toast';
	import IconPlus from '~icons/lucide/plus';
	import { isSeasonFinished } from '$lib/season';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { confirmationDialog } from '$lib/stores/confirmationDialog';

	let { data, form }: PageProps = $props();

	let { season: currentSeason, seasons } = $derived(data);

	let dialogOpen = $state(false);

	// Track which season is being edited
	let editingSeasonId = $state<number | null>(null);

	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('nb-NO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDateTimeLocal(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function toggleEdit(seasonId: number) {
		if (editingSeasonId === seasonId) {
			editingSeasonId = null;
		} else {
			editingSeasonId = seasonId;
		}
	}
</script>

{#snippet fieldGroup(label: string, name: string, value: string | number, type: string = 'text', editing: boolean = false)}
	<div>
		<Label for={name} class="text-xs font-medium text-muted-foreground">{label}</Label>
		{#if editing}
			<Input id={name} {name} {type} {value} class="mt-1 h-8 text-sm" required />
		{:else}
			<div class="mt-0.5 text-sm">{value}</div>
		{/if}
	</div>
{/snippet}

{#snippet dateField(label: string, name: string, value: Date | string, editing: boolean = false)}
	<div>
		<Label for={name} class="text-xs font-medium text-muted-foreground">{label}</Label>
		{#if editing}
			<Input id={name} {name} type="datetime-local" value={formatDateTimeLocal(value)} class="mt-1 h-8 text-xs" required />
		{:else}
			<div class="mt-0.5 text-xs">{formatDate(value)}</div>
		{/if}
	</div>
{/snippet}

{#snippet numberField(label: string, name: string, value: number, editing: boolean = false, step: string = '1')}
	<div>
		<Label for={name} class="text-xs text-muted-foreground">{label}</Label>
		{#if editing}
			<Input id={name} {name} type="number" {value} {step} class="mt-1 h-8 text-sm" required />
		{:else}
			<span class="ml-1 font-medium">{value}</span>
		{/if}
	</div>
{/snippet}

<div class="container mx-auto px-4 py-8">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Administrer Sesonger</h1>
				<p class="mt-2 text-muted-foreground">Rediger, slett eller lag ny sesong</p>
			</div>
			<Button onclick={() => (dialogOpen = true)}>
				<IconPlus class="mr-2 h-4 w-4" />
				Ny sesong
			</Button>
		</div>
	</div>

	<Accordion.Root type="single" class="space-y-2">
		{#each seasons as season}
			{@const isEditing = editingSeasonId === season.id}
			<Accordion.Item class="border-0" value={season.id.toString()}>
				<Card class={cn('gap-2 py-2 shadow-none')}>
					<CardHeader>
						<Accordion.Trigger class="w-full items-center hover:no-underline">
							<div class="flex w-full items-center justify-between gap-4">
								<div class="flex items-center gap-2">
									<CardTitle class="text-lg">{season.name}</CardTitle>
									{#if currentSeason?.id === season.id && !isSeasonFinished(season)}
										<span class="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white"> Aktiv </span>
									{/if}
								</div>
							</div>
						</Accordion.Trigger>
					</CardHeader>

					<Accordion.Content>
						<CardContent class="space-y-6">
							<form
								class="space-y-4 pt-0"
								method="POST"
								action="?/update"
								use:enhance={async ({}) => {
									return async ({ result, update }) => {
										if (result.type === 'success') {
											toasts.add('Sesong oppdatert!', 'success');
										} else {
											toasts.add('Noe gikk galt ved oppdatering av sesong.', 'error');
										}
										editingSeasonId = null;
										await update();
									};
								}}
							>
								<input type="hidden" name="season_id" value={season.id} />

								<div class="flex items-center justify-end gap-2">
									{#if isEditing}
										<Button type="submit" variant="default" size="sm">
											<IconSave class="mr-2 h-4 w-4" />
											Lagre endringer
										</Button>
										<Button type="button" variant="outline" size="sm" onclick={() => toggleEdit(season.id)}>
											<IconX class="mr-2 h-4 w-4" />
											Avbryt
										</Button>
									{:else}
										<Button type="button" variant="outline" size="sm" onclick={() => toggleEdit(season.id)}>
											<IconEdit class="mr-2 h-4 w-4" />
											Rediger
										</Button>
									{/if}
								</div>

								<!-- Basic Information -->
								<div class="rounded-lg border p-3">
									<h4 class="mb-2 text-sm font-semibold">Grunnleggende informasjon</h4>
									<div class="grid gap-3 sm:grid-cols-2">
										{@render fieldGroup('Navn', 'name', season.name, 'text', isEditing)}
										{@render fieldGroup('Startkapital', 'starting_currency', season.starting_currency, 'number', isEditing)}
									</div>
								</div>

								<!-- Timestamps -->
								<div class="rounded-lg border p-3">
									<h4 class="mb-2 text-sm font-semibold">Tidspunkter</h4>
									<div class="grid gap-3 sm:grid-cols-3">
										{@render dateField('Start', 'start_time', season.start_time, isEditing)}
										{@render dateField('Deadline', 'deadline_time', season.deadline_time, isEditing)}
										{@render dateField('Slutt', 'end_time', season.end_time, isEditing)}
									</div>
								</div>

								<!-- Points Distribution -->
								<div class="rounded-lg border p-3">
									<h4 class="mb-2 text-sm font-semibold">Poengfordeling</h4>
									<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
										{@render numberField('Mål', 'points_per_goal', season.points_per_goal, isEditing)}
										{@render numberField('Assist', 'points_per_assist', season.points_per_assist, isEditing)}
										{@render numberField('Clutch', 'points_per_clutch', season.points_per_clutch, isEditing)}
										{@render numberField('Seier', 'points_per_win', season.points_per_win, isEditing)}
										{@render numberField('Hold nullen', 'points_per_clean_sheet', season.points_per_clean_sheet, isEditing)}
									</div>
								</div>
							</form>
							<!-- Delete Section -->
							{#if !isEditing}
								<div class="rounded-lg border border-destructive/50 bg-destructive/5 p-3">
									<h4 class="mb-1.5 text-sm font-semibold text-destructive">Farlig sone</h4>
									<p class="mb-2 text-xs text-muted-foreground">
										Sletting av en sesong kan ikke angres. Vær sikker på at det ikke finnes relaterte data.
									</p>
									<form
										method="POST"
										action="?/delete"
										use:enhance={async ({ cancel }) => {
											const confirmed = await confirmationDialog.confirm({
												variant: 'destructive',
												description: 'Er du sikker på at du vil slette denne sesongen? Denne handlingen kan ikke angres.'
											});

											if (!confirmed) {
												cancel();
												return;
											}
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toasts.add('Sesong slettet!', 'success');
												} else {
													toasts.add('Noe gikk galt ved sletting av sesong.', 'error');
												}
												await update();
											};
										}}
									>
										<input type="hidden" name="seasonId" value={season.id} />
										<Button type="submit" variant="destructive" size="sm">
											<IconDelete class="mr-2 h-4 w-4" />
											Slett sesong
										</Button>
									</form>
								</div>
							{/if}
						</CardContent>
					</Accordion.Content>
				</Card>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Opprett ny sesong</Dialog.Title>
		</Dialog.Header>
		<form
			action="?/create"
			method="post"
			class="grid grid-cols-[1fr] gap-4 py-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type == 'success') {
						toasts.add('Sesong opprettet!', 'success');
					} else {
						toasts.add('Noe gikk galt ved opprettelse av sesong.', 'error');
					}
					dialogOpen = false;
					update();
				};
			}}
		>
			{@render fieldGroup('Navn', 'name', 'Julebord Futsalturnering 2025', 'text', true)}
			{@render numberField('Startkapital', 'starting_currency', 20000, true)}
			{@render dateField('Starttidspunkt', 'start_time', '', true)}
			{@render dateField('Deadlinetidspunkt', 'deadline_time', '', true)}
			{@render dateField('Sluttidspunkt', 'end_time', '', true)}
			{@render numberField('Poeng per mål', 'points_per_goal', 6, true)}
			{@render numberField('Poeng per assist', 'points_per_assist', 3, true)}
			{@render numberField('Poeng per clutch', 'points_per_clutch', 3, true)}
			{@render numberField('Poeng per seier', 'points_per_win', 2, true)}
			{@render numberField('Poeng per clean sheet', 'points_per_clean_sheet', 1, true)}

			<Dialog.Footer>
				<Button variant="outline" onclick={() => (dialogOpen = false)}>Avbryt</Button>
				<Button type="submit">Opprett sesong</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
