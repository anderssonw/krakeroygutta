<script lang="ts">
	import type { SeasonForm } from '$lib/types/newTypes';
	import TextField from '../common/TextField.svelte';

	export let season: SeasonForm | undefined = undefined;
</script>

<div class="form-structure">
	{#if season}
		<div class="w-full flex flex-row justify-around">
			<input name="seasonId" type="hidden" value={season.id} />
			<p>Sesong ID:</p>
			<p>{season.id}</p>
		</div>
	{/if}
	<TextField header="Navn på sesong" label="seasonName" type="text" placeholder="Vinter 2024" value={season?.name} />
	<TextField header="Pengesekk" label="seasonStartingCurrency" type="number" placeholder={'25000'} value={season?.startingCurrency} />
	<TextField header="Startdato" label="seasonStart" type="datetime-local" value={season?.startTime} />
	<TextField header="Deadlinedato" label="seasonDeadline" type="datetime-local" value={season?.deadlineTime} />
	<TextField header="Sluttdato" label="seasonEnd" type="datetime-local" value={season?.endTime} />
	<button class="btn bg-green-500">
		{season?.id ? 'Oppdater sesong' : 'Lag ny sesong'}
	</button>
</div>
