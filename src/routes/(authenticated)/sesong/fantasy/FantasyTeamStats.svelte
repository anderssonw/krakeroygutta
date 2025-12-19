<script lang="ts">
	import type { SeasonAndTeamPlayer } from '$lib/types/player';
	import { getPlayerAverage } from '$lib/player';
	import { TEAM_SIZE } from './validation';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	type Props = {
		players: SeasonAndTeamPlayer[];
		selectedPlayerIds: number[];
		captainPlayerId: number | null;
		budget: number;
		teamName: string;
		onTeamNameChange: (name: string) => void;
		disabled?: boolean;
	};

	let { players, selectedPlayerIds, captainPlayerId, budget, teamName, onTeamNameChange, disabled = false }: Props = $props();

	const selectedPlayers = $derived(players.filter((p) => selectedPlayerIds.includes(p.id)));
	const totalCost = $derived(selectedPlayers.reduce((sum, p) => sum + (p.price ?? 0), 0));
	const remainingCash = $derived(budget - totalCost);
	const averageRating = $derived(
		selectedPlayers.length > 0 ? Math.round(selectedPlayers.reduce((sum, p) => sum + getPlayerAverage(p), 0) / selectedPlayers.length) : 0
	);
	const captain = $derived(selectedPlayers.find((p) => p.id === captainPlayerId));

	const stats = $derived([
		{
			label: 'Spillere',
			value: `${selectedPlayerIds.length}/${TEAM_SIZE}`,
			colorClass: selectedPlayerIds.length === TEAM_SIZE ? 'text-green-600' : ''
		},
		{
			label: 'Snittrating',
			value: averageRating || '-',
			colorClass: ''
		},
		{
			label: 'Brukt',
			value: totalCost,
			colorClass: remainingCash < 0 ? 'text-red-600' : ''
		},
		{
			label: 'Gjenstående',
			value: remainingCash,
			colorClass: remainingCash < 0 ? 'text-red-600' : remainingCash >= 0 ? 'text-green-600' : ''
		}
	]);
</script>

<Card.Root class="mx-auto my-8 max-w-2xl">
	<Card.Content>
		<div class="mb-4">
			<Label class="mb-2" for="team-name">Lagnavn:</Label>
			<Input
				id="team-name"
				type="text"
				placeholder="Skriv inn lagnavn..."
				value={teamName}
				oninput={(e) => onTeamNameChange(e.currentTarget.value)}
				{disabled}
			/>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{#each stats as stat}
				<div class="rounded-md bg-muted p-3 text-center">
					<p class="text-sm text-muted-foreground">{stat.label}</p>
					<p class="text-2xl font-bold {stat.colorClass}">
						{stat.value}
					</p>
				</div>
			{/each}
		</div>

		<div class="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
			<p class="text-sm font-medium">
				⭐ Kaptein:
				{#if captain}
					<span class="font-bold">{captain.name}</span>
				{:else}
					<span>-</span>
				{/if}
			</p>
		</div>
	</Card.Content>
</Card.Root>
