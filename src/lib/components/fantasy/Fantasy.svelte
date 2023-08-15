<script lang="ts">
	import SpinnerIcon from "$lib/shared/spinnerIcon.svelte";
    import type { CreateFantasy, Fantasy, FantasyForm, Player, Season, UserClient } from "$lib/types/newTypes";
	import CardSmall from "../fantasy/CardSmall.svelte";
	import SelectCardModal from "./SelectCardModal.svelte";
    import { supabase } from "$lib/supabase";
	import { onMount } from "svelte";

    export let user: UserClient;
    export let activeSeason: Season;
    export let players: Player[];
    export let fantasy: Fantasy | null;

    console.log(activeSeason);
    console.log(fantasy);

    const fantasyStartCash: number = 20000;

    // Initialize a form to be edited
    let fantasyForm: FantasyForm = {
        team: [{} as Player, {} as Player, {} as Player, {} as Player],
        cash: fantasyStartCash,
        captain: -1,
        selectedCard: -1,
    }
    $: hasCardSelected = (fantasyForm.selectedCard >= 0) ? true : false;

    /* TODO: List of players updated based on USER selection and ALL available */
    
    let isLoadingPage: boolean = false;
    onMount(() => {
        if (fantasy) {
            let myPlayers = players.filter(player => fantasy?.players.includes(player.pid))
            for (var i = 0; i < myPlayers.length; i++) {
                fantasyForm.team[i] = myPlayers[i];
            }
            fantasyForm.cash = JSON.parse(JSON.stringify(fantasy?.cash));
            fantasyForm.captain = JSON.parse(JSON.stringify(fantasy?.captain));
        }
        isLoadingPage = false;
	});
    

    let loading = false;
    const handleFantasyCreation = async () => {
        // Start loading to show processing
        loading = true;

        // Check errors
        if (!fantasyForm.team.every((p: Player) => p.pid)) {
            alert("Select 4 players before saving");
            loading = false;
        }
        else if (fantasyForm.captain == -1) {
            alert("Select a captain before saving");
            loading = false;
        } else {
            try {
                // Create new season
                let newFantasy: CreateFantasy = {
                    uid: user.uid,
                    sid: activeSeason.sid,
                    team_name: "SkulleChippa FC",
                    players: fantasyForm.team.map((p: Player) => p.pid),
                    captain: fantasyForm.captain,
                    cash: fantasyForm.cash
                }
                const { error } = await supabase.from('usersfantasy').insert(newFantasy);

                if (error) {
                    alert(error.message);
                } else {
                    alert("Fantasy team created!");
                    location.reload();
                }
            } finally {
                loading = false;
            }
        }
    }
</script>


<SelectCardModal players={players} bind:fantasyForm={fantasyForm} bind:hasCardSelected={hasCardSelected} />

<div class="structure">
    {#if isLoadingPage}
        <SpinnerIcon />
    {:else}
        {#if !activeSeason.sid}
            <h2> Currently no active season </h2>
        {:else}
            <h2> Mitt fantasy lag </h2>
            <h3> Penger: {fantasyForm.cash} </h3>
            <button class="btn" on:click={() => handleFantasyCreation()}> SAVE </button>

            <div class="relative flex flex-wrap w-full">
                
                <img src="/fantasy/Field.png" alt="field" />


                {#each fantasyForm.team as player, idx}
                    <div class="absolute player-{idx}">
                        <CardSmall player={player} position={idx} bind:fantasyForm={fantasyForm} />
                    </div>
                {/each}
                
            </div>
            
            <div class="relative w-full bg-primary-color block tablet:hidden">
                <!--
                {#each myTeam as player, idx}
                    <MobileCard player={player} position={idx} bind:isSelectingPlayer={isSelectingPlayer} bind:playerIndex={playerIndex} />
                {/each}
                -->
            </div>
        {/if}
    {/if}
</div>