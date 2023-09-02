<script lang="ts">
    export let label: string;
    export let placeholder: string;
	export let type: string;
	export let value: any;

    function typeAction(node: any) {
        node.type = type;
    }
</script>

<div class="w-full">
    <label for="{label}" class="block mb-1"><h5>{label}</h5></label>
    <input name="{label}" use:typeAction id="{label}" class="input w-full" placeholder="{placeholder}" bind:value={value} required />
</div>