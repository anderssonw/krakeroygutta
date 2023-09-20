<script lang="ts">
	import { enhance } from '$app/forms';
	import EditIcon from 'virtual:icons/mingcute/edit-line';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import PlusIcon from 'virtual:icons/typcn/plus';

	import TextField from '$lib/components/common/TextField.svelte';
	import type { PageData } from './$types';
	import type { MouseEventHandler } from 'svelte/elements';
	import type { Tables } from '$lib/types/database.helper.types';
	import DropdownMenu from '$lib/components/admin/dropdownMenu.svelte';

	// Get server data
	export let data: PageData;

	$: ({ teams, seasonId, players } = data);

	interface SimplePlayer {
		id: number;
		name: string;
	}

	$: availablePlayers = getAvailablePlayers(playersInsert, players ?? []);

	$: playersInsert = [] as (SimplePlayer | null)[];

	$: playerIdsInForm = getPlayerIdsToString(playersInsert);

	const getAvailablePlayers = (chosenPlayers: (SimplePlayer | null)[], allPlayers: SimplePlayer[]) => {
		if (!players) return [];

		let playersOnTeams: number[] = [];
		teams?.forEach((team) => (playersOnTeams = playersOnTeams.concat(team.teams_players.map((player) => player.player_id))));

		return players.filter((player) => {
			if (playersOnTeams.includes(player.id)) return false;

			let playerIsChosen = chosenPlayers.find((chosenPlayer) => {
				if (!chosenPlayer) return false;

				return chosenPlayer.id === player.id;
			});

			return playerIsChosen ? false : true;
		});
	};

	const getPlayerIdsToString = (playersInserted: (SimplePlayer | null)[]) => {
		let playerIds: number[] = [];
		playersInserted.forEach((player) => {
			if (!player) return;

			playerIds.push(player.id);
		});

		console.log('playerids: ', playerIds.join(','));

		return playerIds.join(',');
	};

	interface TeamForm {
		id?: number;
		name: string;
		color: string;
		players: number[];
	}

	$: modalTeam = {
		id: -1,
		name: '',
		color: '',
		players: []
	} satisfies TeamForm;

	const showTeamEditModal = (team: Tables<'teams'>): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector('dialog');
		modalTeam = {
			id: team.id,
			name: team.name,
			color: team.color,
			players: []
		} satisfies TeamForm;

		dialog?.showModal();
		return;
	};

	const closeTeamEditModal = (): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector('dialog');
		dialog?.close();
		return;
	};

	const openTeamDeleteModal = (): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector('dialog#delete-dialog') as HTMLDialogElement;
		dialog?.showModal();
		return;
	};

	const closeTeamDeleteModal = (): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector('dialog#delete-dialog') as HTMLDialogElement;
		dialog?.close();
		return;
	};
</script>

<div class="structure">
	{#if teams && teams.length > 0}
		<table class="w-2/3">
			<tr class="text-left">
				<th>Navn</th>
				<th>Farge</th>
				<th>Spillere</th>
				<th />
			</tr>
			{#each teams as team}
				<tr>
					<td>{team.name}</td>
					<td>{team.color}</td>
					<td>
						<div class="flex flex-col">
							<div class="flex flex-row flex-wrap">
								{#each team.teams_players as player}
									<p class="pr-6">
										{player.player_id}
									</p>
								{/each}
							</div>
						</div>
					</td>
					<td>
						<div class="flex flex-row justify-evenly">
							<form method="POST" action="?/update">
								<dialog id="edit-modal" class="p-6 rounded-lg drop-shadow-lg bg-primary-color-light text-secondary-color-dark">
									<div class="flex flex-col items-center">
										<p>This is the modal</p>
										<button class="mt-2 btn bg-red-500 w-[50%]" type="button" on:click={closeTeamEditModal}>Avbryt</button>
									</div>
								</dialog>
								<button type="button" on:click={showTeamEditModal(team)}>
									<EditIcon class="cursor-pointer" />
								</button>
							</form>
							<form method="POST" action="?/delete" use:enhance={({}) => {}}>
								<dialog id="delete-dialog" class="p-6 rounded-lg drop-shadow-lg bg-primary-color-light text-secondary-color-dark">
									<div class="flex flex-col items-center">
										<p>Er du sikker på at du vil slette laget med id {team.id}?</p>
										<button class="mt-2 btn bg-green-500 w-[50%]" type="submit" on:click={closeTeamDeleteModal}>Ja</button>
										<button class="mt-2 btn bg-red-500 w-[50%]" type="button" on:click={closeTeamDeleteModal}>Avbryt</button>
									</div>
								</dialog>
								<input type="hidden" name="teamId" value={team.id} />
								<input type="hidden" name="seasonId" value={seasonId} />
								<button type="button" on:click={openTeamDeleteModal}>
									<DeleteIcon class="cursor-pointer" />
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</table>
	{:else}
		<p>Det ser ikke ut som det er noen lag på denne sesongen. Bruk formen under for å sette i gang!</p>
	{/if}

	<h4>Legg til nytt lag</h4>

	<form class="form" method="POST" action="?/create" use:enhance={({}) => {}}>
		<div class="form-structure">
			<TextField header="Lagnavn" label="name" type="text" placeholder="Gutta G" />
			<TextField header="Lagfarge" label="color" type="text" placeholder="Svart" />
			<div class="flex flex-col items-center w-full">
				<p class="text-md">Spillere</p>
				{#each playersInsert as player, i}
					<div class="w-full my-2 flex flex-row items-center">
						<DropdownMenu option={`spiller ${i + 1}`} bind:options={availablePlayers} bind:selectedOption={player} />
						<button
							class="p-2"
							type="button"
							on:click={() => {
								playersInsert.splice(i, 1);
								playersInsert = playersInsert;
							}}
						>
							<DeleteIcon />
						</button>
					</div>
				{/each}
				<button
					type="button"
					class="mt-2 button w-6 h-6 rounded-full bg-green-700"
					on:click={() => {
						if (availablePlayers.length === 0) {
							alert('Det er ikke flere ledige spillere');
						} else {
							playersInsert.push(null);
							playersInsert = playersInsert;
						}
					}}
				>
					<PlusIcon class="mx-auto" />
				</button>
			</div>
			<input hidden name="season_id" value={Number(seasonId)} />
			<input hidden name="playerIds" value={playerIdsInForm} />
			<button type="submit" class="btn">Legg til</button>
		</div>
	</form>
</div>
