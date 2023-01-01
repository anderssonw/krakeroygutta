<script lang="ts">
	interface Cell {
		cellNumber: number;
		prisoners: string[];
	}
	const cells: Cell[] = [];

	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 3; j++) {
			cells.push({
				cellNumber: Number(i + 1 + '0' + j),
				prisoners: []
			});
		}
	}

	console.log(cells);
</script>

<main class="content">
	<h1>Test</h1>
	<p>{cells}</p>
</main>

<style>
</style>
