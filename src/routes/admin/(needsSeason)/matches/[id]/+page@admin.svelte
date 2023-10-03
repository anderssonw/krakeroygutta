<script lang="ts">
	import Player from '$lib/components/players/Player.svelte';
	import { stringify } from 'postcss';
	import type { MouseEventHandler } from 'svelte/elements';

	let match = {
		id: 3,
		homeTeamName: 'Grå Grever',
		homeTeamGoals: 2,
		awayTeamName: 'Røde Raspere',
		awayTeamGoals: 0,
		goals: [{ player_id: 1 }, { player_id: 2 }],
		assists: [{ player_id: 2 }, { player_id: 1 }],
		clutches: [{ player_id: 3 }, { player_id: 2 }]
	};

	let availablePlayers = [
		{
			name: 'Navnesen',
			id: 1
		},
		{
			name: 'Brorsen',
			id: 2
		},
		{
			name: 'Kallesen',
			id: 3
		}
	];

	const openDialogById = (id: string): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.getElementById(id) as HTMLDialogElement;
		dialog.showModal();

		return;
	};

	const closeDialogById = (id: string): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.getElementById(id) as HTMLDialogElement;
		dialog.close();

		return;
	};

	function submitGoal(): any {
		throw new Error('Function not implemented.');
	}
</script>

<div class="structure flex-col justify-evenly flex-wrap text-center">
	<h2>Administrer kamp ID: {match.id}</h2>
	<h3>{`${match.homeTeamName} ${match.homeTeamGoals} | ${match.awayTeamGoals} ${match.awayTeamName}`}</h3>

	<div class="flex flex-row">
		<div class="flex flex-col">
			<p>Se-momenter</p>
			{#each match.clutches as clutch}
				<div class="flex flex-row">
					<p>{`Se-moment: ${clutch.player_id}`}</p>
				</div>
			{:else}
				<p>Ingen Se-momenter denne kampen</p>
			{/each}
			<button type="button" class="btn" on:click={() => openDialogById('new-clutch')}>Nytt se-moment</button>
		</div>

		<div class="flex flex-col">
			<p>Mål / Assist</p>
			{#each match.goals as goal, index}
				<div class="flex flex-row">
					<p>{`Mål: ${goal.player_id}`}</p>
					<p>{`Assist: ${match.assists[index].player_id}`}</p>
				</div>
			{:else}
				<p>Ingen Mål / Assist denne kampen</p>
			{/each}
			<button type="button" class="btn" on:click={() => openDialogById('new-goal')}>Nytt mål</button>
		</div>
	</div>

	<dialog id="new-clutch" class="px-10 py-4 rounded-lg text-left">
		<div class="flex flex-col">
			<h4>Nytt Se-moment</h4>

			<label class="mt-4" for="goal">
				Spiller
				<select name="goal" id="goal">
					{#each availablePlayers as player}
						<option>{player.name}</option>
					{/each}
				</select>
			</label>

			<button type="button" class="btn mt-4" on:click={() => submitGoal()}>Legg til </button>
			<button type="button" class="btn mt-4" on:click={() => closeDialogById('new-clutch')}> Lukk </button>
		</div>
	</dialog>

	<dialog id="new-goal" class="px-10 py-4 rounded-lg text-left">
		<div class="flex flex-col">
			<h4>Nytt mål</h4>

			<label class="mt-4" for="goal">
				Mål
				<select name="goal" id="goal">
					{#each availablePlayers as player}
						<option>{player.name}</option>
					{/each}
				</select>
			</label>

			<label for="assist">
				Assist
				<select class="border-2 rounded-sm" name="assist" id="assist">
					{#each availablePlayers as player}
						<option>{player.name}</option>
					{/each}
				</select>
			</label>

			<button type="button" class="btn mt-4" on:click={() => submitGoal()}>Legg til </button>
			<button type="button" class="btn mt-4" on:click={() => closeDialogById('new-goal')}> Lukk </button>
		</div>
	</dialog>
</div>
