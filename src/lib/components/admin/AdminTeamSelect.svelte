<script lang="ts">
	/**
	 * The teams to select from. Should not include other chosen teams, but should include the team that is chosen on this select.
	 */
	export let teams: { id: number; name: string }[];

	/**
	 * The variable in which to bind the chosen option to
	 */
	export let value: number | undefined = undefined;

	/**
	 * Description of selected option
	 */
	export let label: string;

	/**
	 * Used as select id and name, for correctly labeling and having the correct form id.
	 */
	export let id: string;
</script>

<div class="flex flex-col">
	<label class="my-2" for={id}>{label}</label>
	<select class="rounded-md py-2 bg-inherit border-2" {id} name={id} bind:value>
		<option class="text-primary-color-dark" value={undefined}>Velg lag</option>
		{#each teams as team}
			<option class="text-primary-color-dark" value={team.id}>
				{team.name}
			</option>
		{/each}
	</select>
</div>
