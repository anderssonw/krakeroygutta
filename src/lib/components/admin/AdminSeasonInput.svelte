<script lang="ts">
	import type { Tables } from '$lib/types/database.helper.types';
	import TextField from '../common/TextField.svelte';

	export let id: number | null;
	export let name: string = '';
	export let startingCurrency: number = 0;
	export let startTime: string = '';
	export let deadlineTime: string = '';
	export let endTime: string = '';
	export let pointsPerWin: number = 1;
	export let pointsPerCleanSheet: number = 1;
	export let pointsPerGoal: number = 1;
	export let pointsPerAssist: number = 1;
	export let pointsPerClutch: number = 1;
</script>

<div class="form-structure">
	<input name="seasonId" type="hidden" value={id} />
	<TextField header="Navn på sesong" label="seasonName" type="text" placeholder="Vinter 2024" value={name} />
	<TextField header="Pengesekk" label="seasonStartingCurrency" type="number" placeholder={'25000'} value={startingCurrency} />
	<TextField header="Startdato" label="seasonStart" type="datetime-local" value={startTime} />
	<TextField header="Deadlinedato" label="seasonDeadline" type="datetime-local" value={deadlineTime} />
	<TextField header="Sluttdato" label="seasonEnd" type="datetime-local" value={endTime} />
	<TextField header="Poeng per seier" label="seasonPointsPerWin" type="number" value={pointsPerWin} />
	<TextField header="Poeng per clean sheet" label="seasonPointsPerCleanSheet" type="number" value={pointsPerCleanSheet} />
	<TextField header="Poeng per mål" label="seasonPointsPerGoal" type="number" value={pointsPerGoal} />
	<TextField header="Poeng per assist" label="seasonPointsPerAssist" type="number" value={pointsPerAssist} />
	<TextField header="Poeng per c-moment" label="seasonPointsPerClutch" type="number" value={pointsPerClutch} />
	<button class="btn bg-green-500">
		{id ? 'Oppdater sesong' : 'Lag ny sesong'}
	</button>
</div>
