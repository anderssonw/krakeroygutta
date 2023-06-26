<script lang="ts">
	import { goto } from "$app/navigation";
    import type { Player } from "$lib/types/newTypes";
    export let player: Player;
</script>

<div class="relative w-60 h-64 bg-secondary-color rounded-lg shadow-lg hover:scale-105 active:scale-100 flex flex-col items-center" on:mouseup={() => goto(`/players/${player.PlayerID}`)}>
    <div class=" relative w-full h-32 bg-secondary-color-dark rounded-lg">
        <div class="h-26 w-32 absolute bottom-0 left-1/2 -translate-x-1/2">
            <img src="Placeholder.png" alt="head" />
        </div>
    </div>
    <p class="text-primary-color text-center">
        { player.Name }
    </p>
    <div class="w-2/3 flex flex-row justify-between">
        <p class="text-primary-color text-center">
            Goals
        </p>
        <p class="text-primary-color text-center">
            { player.Goals }
        </p>
    </div>
    <div class="w-2/3 flex flex-row justify-between">
        <p class="text-primary-color text-center">
            Assist
        </p>
        <p class="text-primary-color text-center">
            { player.Assist }
        </p>
    </div>
    <div class="w-2/3 flex flex-row justify-between">
        <p class="text-primary-color text-center">
            Clutch
        </p>
        <p class="text-primary-color text-center">
            { player.Clutch }
        </p>
    </div>
</div>