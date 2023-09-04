<script lang="ts">
	import AdminDropdown from "$lib/shared/AdminDropdown.svelte";
	import TextField from "$lib/shared/TextField.svelte";
	import type { DropdownOption } from "$lib/types/newTypes";
	import Players from "../players/Players.svelte";
	import DropdownMenu from "./dropdownMenu.svelte";

    let showTeams: boolean = false;

    let dropdownOptions: DropdownOption[] = [
        {
            id: 1,
            name: "Option 1"
        },
        {
            id: 2,
            name: "Option 2"
        },
    ]
    let colorOption: DropdownOption = {} as DropdownOption;
    let seasonOption: DropdownOption = {} as DropdownOption;
    let players: string[] = []

    function addPlayer() {
        players.push("Magnus Gulbrandsen")
        players = players;
    }
    function removePlayer() {
        players.pop()
        players = players;
    }
</script>

<AdminDropdown title={'lag'} bind:showContent={showTeams} />

{#if showTeams}
    <h3> Legg til nytt lag </h3>

    <form class="form" method="POST">
        <div class="form-structure">
            <TextField header="Lag navn" label="teamName" type="text" placeholder="Gutta G" />
            <DropdownMenu title={"Lag farge"} option={"farge"} options={dropdownOptions} bind:selectedOption={colorOption}/>
            <DropdownMenu title={"Sesong"} option={"sesong"} options={dropdownOptions} bind:selectedOption={seasonOption}/>
            <div class="w-full">
                <div class="block mb-1"><h5>Spillere</h5></div>
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" class="btn" on:click={addPlayer}> Legg til </button>
                    <button type="button" class="btn" on:click={removePlayer}> Fjern </button>
                </div>
                {#each players as player}
                    <div class="border-2 input mt-2">
                        <p>{player}</p>
                    </div>
                {/each}
            </div>
            <div>
                <input type="submit" class="btn" value={'Lag nytt lag'} />
            </div>
        </div>
    </form>
{/if}
