<script lang="ts">
    import { supabase } from "$lib/supabase";
	import DropdownMenu from "$lib/shared/dropdownMenu.svelte";
	import type { CreateTeam, DropdownOption, Player, Season, Team, TeamColor } from "$lib/types/newTypes";

    export let activeSeason: Season | null;
    export let allSeasons: Season[];
    export let allPlayers: Player[];
    export let allTeams: Team[];

    // Based on tailwind colors
    let allColors: TeamColor[] = [
        {tid: 1, name: "red"},
        {tid: 2, name: "green"},
        {tid: 3, name: "blue"},
        {tid: 4, name: "neutral"}
    ]

    let showTeams: boolean = false;
    let teamSeason: DropdownOption = {} as DropdownOption;
    let teamName: string = "";
	let teamColor: DropdownOption = {} as DropdownOption;
    let teamPlayers: DropdownOption[] = [];

    let loading = false;

    const addPlayer = () => {
        teamPlayers.push({} as DropdownOption);
        teamPlayers = teamPlayers;
    }
    const removePlayer = () => {
        teamPlayers.pop();
        teamPlayers = teamPlayers;
    }

    const handleTeamCreation = async () => {
        try {
            // Create new team
            let newTeam: CreateTeam = {
                sid: teamSeason.id,
                name: teamName,
                color: teamColor.name,
                players: teamPlayers.map((p) => p.id)
            }
            const { error } = await supabase.from('teams').insert(newTeam);

            if (error) {
                alert(error.message);
            } else {
                alert("New team created!");
                location.reload();
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex flex-row items-center space-x-4">
    <h2> Administrer lag </h2>
    <div class="hover:cursor-pointer" on:mouseup={() => showTeams = !showTeams }>
        {#if showTeams}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="fill-secondary-color-light" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
        {/if}
    </div>
</div>
{#if showTeams}
    <div class="w-full bg-primary-color text-center">
        <h3> Eksisterende lag ({activeSeason?.name})</h3>
        {#each allTeams as team}
            <p> 
                Lag {team.color} (
                    {#each team.players as id}
                        {allPlayers.filter(p => p.pid == id).map(p => p.name)},
                    {/each}
                )
            </p>
        {/each}

        <h3> Legg til nytt lag </h3>
        <form class="flex flex-col items-center justify-center" on:submit|preventDefault={handleTeamCreation}>
            <div class="mb-6">
                <h4>Sesong:</h4>
                <DropdownMenu option={"season"} options={allSeasons} bind:selectedOption={teamSeason}/>
            </div>
            <div class="mb-6">
                <label for="teamName" class="block mb-1"><h4>Lag navn:</h4></label>
                <input type="text" id="teamName" class="input" placeholder="Idiotene" bind:value={teamName}>
            </div>
            <div class="mb-6">
                <h4>Farge:</h4>
                <DropdownMenu option={"color"} options={allColors} bind:selectedOption={teamColor}/>
            </div> 
            <div class="mb-6">
                <h4>Spillere:</h4>
                {#each teamPlayers as player}
                    <DropdownMenu option={"player"} options={allPlayers} bind:selectedOption={player}/>
                {/each}
                <div class="flex flex-row mt-4 space-x-2">
                    <button type="button" class="btn" on:click={addPlayer}> Add player </button>
                    <button type="button" class="btn" on:click={removePlayer}> Remove player </button>
                </div>
            </div>
            <div class="mb-6 flex justify-center">
                <input 
                    type="submit" 
                    class="btn" 
                    value={loading ? 'Laster' : 'Lag nytt lag'}
                    disabled={loading} />
            </div>
        </form>
    </div>
{/if}