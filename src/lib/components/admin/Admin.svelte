<script lang="ts">
    import type { Player, Season, Team } from "$lib/types/newTypes";
	import AdmSeasons from "./AdmSeasons.svelte";
	import AdmTeams from "./AdmTeams.svelte";

    export let activeSeason: Season | null;
    export let allSeasons: Season[];
    export let allPlayers: Player[];
    export let allTeams: Team[];

    console.log(allSeasons);
    console.log(allPlayers);
    console.log(allTeams);
</script>


<div class="structure">
    <AdmSeasons activeSeason={activeSeason} allSeasons={allSeasons} />

    <AdmTeams activeSeason={activeSeason} allSeasons={allSeasons} allPlayers={allPlayers} allTeams={allTeams} />

    <h2> If season, give points </h2>
    <div class="w-full h-96 bg-primary-color">

    </div>
</div>