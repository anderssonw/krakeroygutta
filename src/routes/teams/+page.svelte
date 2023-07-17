
<script>
    let clickChange = false;
    $: selectionVisible = `transition-all duration-1000 ${
		clickChange ? "bg-black/20 hidden" : "bg-black/100 block"
	}`;
</script>

<div class="structure">
    <h2>Teams</h2>
    <div class="w-96 h-96 {selectionVisible}">
    </div>
    <button class="btn" on:click={() => clickChange = !clickChange}> CHANGE </button>
</div>