<script lang="ts">
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import ArrowLeftIcon from 'virtual:icons/ph/arrow-left';

	import { enhance } from '$app/forms';
	import type { MouseEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';

	let match = {
		id: 3,
		seasonId: 2,
		homeTeamName: 'Grå Grever',
		homeTeamGoals: 2,
		awayTeamName: 'Røde Raspere',
		awayTeamGoals: 0,
		goals: [
			{ player_id: 2, id: 4 },
			{ player_id: 3, id: 4 }
		],
		assists: [
			{ player_id: 3, id: 4 },
			{ player_id: 2, id: 4 }
		],
		clutches: [
			{ player_id: 3, id: 19 },
			{ player_id: 2, id: 29 }
		]
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
</script>

<div class="structure flex-col justify-evenly flex-wrap text-center">
	<button class="flex items-center" type="button" on:click={() => goto(`/admin/matches?season=${match.seasonId}`)}>
		<ArrowLeftIcon />
		<p class="ml-2">Tilbake til kampoversikt</p>
	</button>
	<h2>Administrer kamp ID: {match.id}</h2>
	<h3>{`${match.homeTeamName} ${match.homeTeamGoals} | ${match.awayTeamGoals} ${match.awayTeamName}`}</h3>

	<div class="flex flex-row justify-around w-full flex-wrap p-6">
		<div class="flex flex-col">
			<p>Mål / Assist</p>
			{#each { length: match.goals.length } as _, index}
				<form action="?/delete-goal-assist" method="POST">
					<input hidden id={`goal_id_${match.goals[index].id}`} name="goal_id" value={match.goals[index].id} />
					<input hidden id={`assist_id_${match.assists[index].id}`} name="assist_id" value={match.assists[index].id} />
					<div class="flex flex-row justify-between border-t-2 py-2">
						<!-- TODO Player name -->
						<div class="text-left">
							<p>{`Mål: ${match.goals[index].player_id}`}</p>
							<p>{`Assist: ${match.assists[index].player_id}`}</p>
						</div>

						<button>
							<DeleteIcon class="cursor-pointer" />
						</button>
					</div>
				</form>
			{:else}
				<p>Ingen Mål / Assist denne kampen</p>
			{/each}
			<button type="button" class="btn mt-4" on:click={() => openDialogById('new-goal')}>Nytt mål</button>
		</div>

		<div class="flex flex-col">
			<p>Se-momenter</p>

			{#each match.clutches as clutch}
				<form action="?/delete-clutch" method="POST">
					<input hidden id={`clutch_id_${clutch.id}`} name="clutch_id" value={clutch.id} />
					<div class="flex flex-row justify-between border-t-2 py-2">
						<!-- TODO Player name -->
						<p>{`Spiller: ${clutch.player_id}`}</p>
						<button>
							<DeleteIcon class="cursor-pointer" />
						</button>
					</div>
				</form>
			{:else}
				<p>Ingen Se-momenter denne kampen</p>
			{/each}

			<button type="button" class="btn mt-4" on:click={() => openDialogById('new-clutch')}>Nytt se-moment</button>
		</div>
	</div>

	<dialog id="new-clutch" class="px-10 py-4 rounded-lg text-left">
		<form class="flex flex-col" action="?/create-clutch" method="POST" use:enhance>
			<h4>Nytt Se-moment</h4>

			<label class="mt-4" for="clutch">
				Spiller
				<select name="clutch" id="clutch">
					{#each availablePlayers as player}
						<option value={player.id}>{player.name}</option>
					{/each}
				</select>
			</label>

			<button class="btn mt-4 bg-green-400" on:click={() => closeDialogById('new-clutch')}>Legg til </button>
			<button type="button" class="btn mt-4 bg-red-400" on:click={() => closeDialogById('new-clutch')}> Lukk </button>
		</form>
	</dialog>

	<dialog id="new-goal" class="px-10 py-4 rounded-lg text-left">
		<form class="flex flex-col" action="?/create-goal-assist" method="POST" use:enhance>
			<h4>Nytt mål</h4>

			<label class="mt-4" for="goal">
				Mål
				<select name="goal" id="goal">
					{#each availablePlayers as player}
						<option value={player.id}>{player.name}</option>
					{/each}
				</select>
			</label>

			<label for="assist">
				Assist
				<select class="border-2 rounded-sm" name="assist" id="assist">
					{#each availablePlayers as player}
						<option value={player.id}>{player.name}</option>
					{/each}
				</select>
			</label>

			<button class="btn mt-4 bg-green-400" on:click={() => closeDialogById('new-goal')}>Legg til</button>
			<button type="button" class="btn mt-4 bg-red-400" on:click={() => closeDialogById('new-goal')}> Lukk </button>
		</form>
	</dialog>
</div>
