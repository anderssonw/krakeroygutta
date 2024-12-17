<script lang="ts">
	import TextField from '../common/TextField.svelte';

	export let id: number | null;
	export let name: string = '';
	export let startingCurrency: number = 0;
	export let startTime: string = '';
	export let deadlineTime: string = '';
	export let endTime: string = '';
</script>

<div class="form-structure">
	<TextField header="Navn på sesong" label="seasonName" type="text" placeholder="Vinter 2024" value={name} />
	<TextField header="Pengesekk" label="seasonStartingCurrency" type="number" placeholder={'25000'} value={startingCurrency} />
	<TextField header="Startdato" label="seasonStart" type="datetime-local" value={startTime} />
	<TextField header="Deadlinedato" label="seasonDeadline" type="datetime-local" value={deadlineTime} />
	<TextField header="Sluttdato" label="seasonEnd" type="datetime-local" value={endTime} />
	<button class="btn bg-green-500">
		{id ? 'Oppdater sesong' : 'Lag ny sesong'}
	</button>
</div>
