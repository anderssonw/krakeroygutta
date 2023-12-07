<script lang="ts">
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import ArrowLeftIcon from 'virtual:icons/ph/arrow-left';

	import { enhance } from '$app/forms';
	import type { MouseEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Tables } from '$lib/types/database.helper.types';
	import ReturnToRoute from '$lib/components/common/ReturnToRoute.svelte';

	export let data: PageData;

	$: ({ match, players, lazy } = data);

	const getGoalCountForTeam = (teamId: number | undefined, goals: Tables<'goals'>[]) => {
		return goals.filter((goal) => {
			const playerForGoal = players?.find((player) => player.id === goal.goal_player_id);

			return playerForGoal?.team_id === teamId;
		}).length;
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
	<ReturnToRoute text="Tilbake til kampoversikt" route={`/admin/matches?season=${match?.season_id}`} />
	{#await lazy.goals}
		<p>Laster</p>
	{:then goals}
		<h2>Administrer kamp ID: {match?.id}</h2>
		<h3>
			{`${match?.team_home?.name} ${getGoalCountForTeam(match?.team_home_id, goals)} - ${getGoalCountForTeam(match?.team_away_id, goals)} ${
				match?.team_away?.name
			}`}
		</h3>
		<div class="flex flex-row justify-around w-full flex-wrap p-6">
			<div class="flex flex-col">
				<p>Mål / Assist</p>

				{#each goals as goal}
					<form action="?/delete-goal" method="POST">
						<input hidden id={`goal_id_${goal.id}`} name="goal_id" value={goal.id} />
						<div class="flex flex-row justify-between border-t-2 py-2">
							<div class="text-left">
								<p>{`Mål: ${players?.find((player) => player.id === goal.goal_player_id)?.name}`}</p>
								<p>{`Assist: ${players?.find((player) => player.id === goal.assist_player_id)?.name || 'Ingen assist'}`}</p>
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

				{#await lazy.clutches}
					<p>Laster</p>
				{:then clutches}
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
				{:catch error}
					<p>Noe gikk galt</p>
				{/await}

				<button type="button" class="btn mt-4" on:click={() => openDialogById('new-clutch')}>Nytt se-moment</button>
			</div>
		</div>
	{:catch error}
		<p>Noe gikk galt</p>
	{/await}

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
		<form class="flex flex-col" action="?/create-goal" method="POST" use:enhance>
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
						<option value={-1}>Ingen assist</option>
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
