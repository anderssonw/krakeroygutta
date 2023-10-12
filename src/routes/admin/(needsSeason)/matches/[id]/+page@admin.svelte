<script lang="ts">
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import ArrowLeftIcon from 'virtual:icons/ph/arrow-left';

	import { enhance } from '$app/forms';
	import type { MouseEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ match, players, lazy } = data);

	let matchTest = {
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
	<button class="flex items-center" type="button" on:click={() => goto(`/admin/matches?season=${matchTest.seasonId}`)}>
		<ArrowLeftIcon />
		<p class="ml-2">Tilbake til kampoversikt</p>
	</button>
	<h2>Administrer kamp ID: {match?.id}</h2>
	<h3>{`${match?.team_home?.name} ${matchTest.homeTeamGoals} | ${matchTest.awayTeamGoals} ${match?.team_away?.name}`}</h3>

	<div class="flex flex-row justify-around w-full flex-wrap p-6">
		<div class="flex flex-col">
			<p>Mål / Assist</p>
			{#each { length: matchTest.goals.length } as _, index}
				<form action="?/delete-goal-assist" method="POST">
					<input hidden id={`goal_id_${matchTest.goals[index].id}`} name="goal_id" value={matchTest.goals[index].id} />
					<input hidden id={`assist_id_${matchTest.assists[index].id}`} name="assist_id" value={matchTest.assists[index].id} />
					<div class="flex flex-row justify-between border-t-2 py-2">
						<!-- TODO Player name -->
						<div class="text-left">
							<p>{`Mål: ${matchTest.goals[index].player_id}`}</p>
							<p>{`Assist: ${matchTest.assists[index].player_id}`}</p>
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

			{#await lazy?.clutches}
				<p>Laster</p>
			{:then clutches}
				{#if clutches}
					{#each clutches as clutch}
						<form action="?/delete-clutch" method="POST">
							<input hidden id={`clutch_id_${clutch.id}`} name="clutch_id" value={clutch.id} />
							<div class="flex flex-row justify-between border-t-2 py-2">
								<p>{`Spiller: ${players?.find((player) => player.id === clutch.player_id)?.name}`}</p>
								<button>
									<DeleteIcon class="cursor-pointer" />
								</button>
							</div>
						</form>
					{:else}
						<p>Ingen Se-momenter denne kampen</p>
					{/each}
				{/if}
			{:catch error}
				<p>Noe gikk galt</p>
			{/await}

			<button type="button" class="btn mt-4" on:click={() => openDialogById('new-clutch')}>Nytt se-moment</button>
		</div>
	</div>

	<dialog id="new-clutch" class="px-10 py-4 rounded-lg text-left">
		<form class="flex flex-col" action="?/create-clutch" method="POST" use:enhance>
			<h4>Nytt Se-moment</h4>

			<label class="mt-4" for="clutch">
				Spiller
				<select name="clutch" id="clutch">
					{#if players}
						{#each players as player}
							<option value={player.id}>{player.name}</option>
						{/each}
					{/if}
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
					{#if players}
						{#each players as player}
							<option value={player.id}>{player.name}</option>
						{/each}
					{/if}
				</select>
			</label>

			<label for="assist">
				Assist
				<select class="border-2 rounded-sm" name="assist" id="assist">
					{#if players}
						{#each players as player}
							<option value={player.id}>{player.name}</option>
						{/each}
					{/if}
				</select>
			</label>

			<button class="btn mt-4 bg-green-400" on:click={() => closeDialogById('new-goal')}>Legg til</button>
			<button type="button" class="btn mt-4 bg-red-400" on:click={() => closeDialogById('new-goal')}> Lukk </button>
		</form>
	</dialog>
</div>
