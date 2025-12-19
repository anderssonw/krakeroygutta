<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import AdminSeasonInput from '$lib/components/admin/AdminSeasonInput.svelte';

	export let data;

	import { page } from '$app/stores';
	import type { PlayerWithStats } from './types.js';
	import type { Tables } from '$lib/types/database.helper.types.js';

	$: ({ season, players } = data);
</script>

<div class="structure">
	{#if season}
		<h2>Administrer Sesong</h2>
		<form
			class="form"
			method="POST"
			action="?/update"
			use:enhance={({}) => {
				return ({ result }) => {
					if (result.type === 'success') {
						invalidate('/');
					}
				};
			}}
		>
			<AdminSeasonInput
				id={season.id}
				name={season.name}
				startingCurrency={season.starting_currency}
				startTime={season.start_time}
				endTime={season.end_time}
				deadlineTime={season.deadline_time}
				pointsPerWin={season.points_per_win}
				pointsPerCleanSheet={season.points_per_clean_sheet}
				pointsPerGoal={season.points_per_goal}
				pointsPerAssist={season.points_per_assist}
				pointsPerClutch={season.points_per_clutch}
			/>
		</form>
	{/if}
</div>
