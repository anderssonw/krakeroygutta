<script lang="ts">
	import EditIcon from 'virtual:icons/mingcute/edit-line';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';

	import { goto } from '$app/navigation';

	import type { Tables } from '$lib/types/database.helper.types';

	import type { PageData } from './$types';
	import AdminSeasonInput from '$lib/components/admin/AdminSeasonInput.svelte';
	import { enhance } from '$app/forms';
	import type { MouseEventHandler } from 'svelte/elements';

	// Get server data
	export let data: PageData;

	$: ({ seasons } = data);

	const getStatusFromSeasonTimes = (season: Tables<'seasons'>) => {
		let today = new Date().getTime();

		if (today > Date.parse(season.end_time)) {
			return 'Fullført';
		}

		if (today < Date.parse(season.start_time)) {
			return 'Kommende';
		}

		if (today > Date.parse(season.start_time) && today < Date.parse(season.end_time)) {
			return 'Pågående';
		}

		return '?';
	};

	const parseSeasonDate = (dateString: string) => {
		let date = new Date(dateString);

		return date.toISOString().split('T')[0];
	};
</script>

<div class="structure">
	<h3>Nåværende sesonger</h3>
	<table class="w-full">
		<tr class="text-left">
			<th>Navn</th>
			<th>Pengesekk</th>
			<th>Start</th>
			<th>Deadline</th>
			<th>Slutt</th>
			<th>Status</th>
			<th />
		</tr>
		{#if seasons}
			{#each seasons as season}
				<tr>
					<td>{season.name}</td>
					<td>{season.starting_currency}</td>
					<td>{parseSeasonDate(season.start_time)}</td>
					<td>{parseSeasonDate(season.deadline_time)}</td>
					<td>{parseSeasonDate(season.end_time)}</td>
					<td>{getStatusFromSeasonTimes(season)}</td>
					<td>
						<div class="flex flex-row justify-evenly">
							<div>
								<button type="button" on:click={() => goto(`/admin/seasons/${season.id}`)}>
									<EditIcon class="cursor-pointer" />
								</button>
							</div>
							<form
								method="POST"
								action="?/delete"
								use:enhance={({ cancel }) => {
									// Should probably use a dialog instead of a confirm, but whatever
									let shouldDelete = confirm(`Er du sikker på at du vil slette sesong med id ${season.id}?`);

									if (!shouldDelete) cancel();
								}}
							>
								<input type="hidden" name="id" value={season.id} />
								<button type="submit">
									<DeleteIcon class="cursor-pointer" />
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		{/if}
	</table>

	<h3>Legg til ny sesong</h3>

	<form class="form" method="POST" action="?/create" use:enhance>
		<AdminSeasonInput id={null} />
	</form>
</div>
