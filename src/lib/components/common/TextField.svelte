<script lang="ts">
	export let header: string;
	export let label: string;
	export let placeholder: string | undefined = undefined;
	export let disabled: boolean = false;
	export let type: string;
	export let value: string | number | undefined = undefined;
	export let required: boolean = true;

	function typeAction(node: any) {
		node.type = type;
	}
</script>

<div class="w-full">
	<label for={label} class="block mb-1"><h5>{header}</h5></label>
	<input name={label} use:typeAction id={label} class="input w-full" {placeholder} {required} {disabled} bind:value />
</div>
