<script lang="ts">
	export let title: string;
</script>

<div class="mb-4 mx-4 flex-1">
	<h2 class="mb-4">{title}</h2>
	<div class="grid gap-4">
		<slot />
	</div>
</div>
