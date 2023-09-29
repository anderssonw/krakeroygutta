<script lang="ts">
	import { enhance } from '$app/forms';
	import EditIcon from 'virtual:icons/mingcute/edit-line';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import type { ActionData, PageData } from './$types';
	import type { MouseEventHandler } from 'svelte/elements';
	import type { Tables } from '$lib/types/database.helper.types';
	import AdminTeamForm from '$lib/components/admin/AdminTeamForm.svelte';
	import type { DropdownOption } from '$lib/types/newTypes';

	import { page } from '$app/stores';
	// Get server data
	export let data: PageData;
	export let form: ActionData;

	$: ({ teams, players } = data);

	$: seasonId = Number($page.url.searchParams.get('season'));

	$: availablePlayers = getAvailablePlayers(playersInsert.concat(modalTeam.players), players ?? []);

	$: playersInsert = [] as (DropdownOption | null)[];

	const getAvailablePlayers = (chosenPlayers: (DropdownOption | null)[], allPlayers: DropdownOption[]) => {
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

	const getDropdownOptionsFromPlayerIds = (playerIds: number[]) => {
		return playerIds.map((id) => {
			let player = players?.find((p) => p.id == id);
			if (!player) return null;
			return {
				id,
				name: player?.name
			};
		});
	};

	const formActionWithSeasonParam = (formAction: string) => {
		let season = $page.url.searchParams.get('season');

		if (season) {
			return `${formAction}&season=${season}`;
		}

		return formAction;
	};

	interface TeamForm {
		id?: number;
		seasonId: number;
		name: string;
		color: string;
		players: (DropdownOption | null)[];
	}

	interface TeamWithPlayers extends Tables<'teams'> {
		teams_players: {
			player_id: number;
		}[];
	}

	$: modalTeam = {
		id: -1,
		name: '',
		color: '',
		seasonId: -1,
		players: [] as (DropdownOption | null)[]
	} satisfies TeamForm;

	const showTeamEditModal = (team: TeamWithPlayers): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector(`dialog#edit-dialog-${team.id}`) as HTMLDialogElement;
		let options = getDropdownOptionsFromPlayerIds(team.teams_players.map((player) => player.player_id));
		modalTeam = {
			id: team.id,
			seasonId: team.season_id,
			name: team.name,
			color: team.color,
			players: options
		} satisfies TeamForm;

		dialog?.showModal();
		return;
	};

	const closeTeamEditModal = (id: number): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector(`dialog#edit-dialog-${id}`) as HTMLDialogElement;
		dialog?.close();
		return;
	};

	const openTeamDeleteModal = (id: number): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector(`dialog#delete-dialog-${id}`) as HTMLDialogElement;

		console.log(modalTeam);
		dialog?.showModal();
		return;
	};

	const closeTeamDeleteModal = (id: number): MouseEventHandler<HTMLButtonElement> | null | undefined => {
		const dialog = document.querySelector(`dialog#delete-dialog-${id}`) as HTMLDialogElement;
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
							<form
								method="POST"
								action="?/update"
								use:enhance={({}) => {
									closeTeamEditModal(team.id);
								}}
							>
								<dialog
									id={`edit-dialog-${team.id}`}
									class="p-6 rounded-lg drop-shadow-lg bg-primary-color-light text-secondary-color-dark"
								>
									<div class="flex flex-col items-center">
										<AdminTeamForm
											bind:availablePlayers
											bind:teamColor={team.color}
											bind:teamName={team.name}
											bind:teamId={team.id}
											bind:seasonId
											bind:playerIds={modalTeam.players}
										/>
										<button class="mt-2 btn bg-red-500 w-[50%]" type="button" on:click={closeTeamEditModal(team.id)}>Avbryt</button>
									</div>
								</dialog>
								<button
									type="button"
									on:click={() => {
										showTeamEditModal(team);
									}}
								>
									<EditIcon class="cursor-pointer" />
								</button>
							</form>
							<form method="POST" action="?/delete" use:enhance>
								<dialog
									id={`delete-dialog-${team.id}`}
									class="p-6 rounded-lg drop-shadow-lg bg-primary-color-light text-secondary-color-dark"
								>
									<div class="flex flex-col items-center">
										<p>Er du sikker på at du vil slette laget {team.name}?</p>
										<button class="mt-2 btn bg-green-500 w-[50%]" type="submit" on:click={closeTeamDeleteModal(team.id)}>Ja</button>
										<button class="mt-2 btn bg-red-500 w-[50%]" type="button" on:click={closeTeamDeleteModal(team.id)}>Avbryt</button>
									</div>
								</dialog>
								<input type="hidden" name="teamId" value={team.id} />
								<input type="hidden" name="seasonId" value={seasonId} />
								<button type="button" on:click={openTeamDeleteModal(team.id)}>
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
	{#if form?.teamDelete?.success}
		<p class="text-green-400">Lag slettet</p>
	{/if}
	{#if form?.teamUpdate?.success}
		<p class="text-green-400">Lag oppdatert</p>
	{/if}
	{#if form?.deletePlayers?.error}
		<p class="text-red-400 max-w-[50ch]">{form.deletePlayers.error}</p>
	{/if}
	{#if form?.updatePlayers?.error}
		<p class="text-red-400 max-w-[50ch]">{form.updatePlayers.error}</p>
	{/if}

	<h4>Legg til nytt lag</h4>

	<form class="form" method="POST" action="?/create">
		<AdminTeamForm bind:availablePlayers bind:seasonId bind:playerIds={playersInsert} formSubmitSuccess={form?.teamInsert?.success} />
	</form>
</div>
