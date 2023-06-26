<script lang="ts">
    import type { Player } from "$lib/types/newTypes";
    export let player: Player | null;
</script>


<div class="structure">
    <img src="/profile/{player?.image}" alt="head"/>
    <h1>{player?.name}</h1>
</div>