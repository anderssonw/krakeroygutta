<!-- <script lang="ts">
	import { supabase } from "$lib/supabase";
    import type { CreateSea$lib/components/common/TextField.sveltees/newTypes";

    export let activeSeason: Season | null;
    export let allSeasons: Season[];

    let showSeasons: boolean = false;
    let seasonName: string = "";
	let seasonStart: string = "";
    let seasonEnd: string = "";

    let loading = false;

    const handleSeasonCreation = async () => {
        // Start loading to show processing
        loading = true;

        // Check that it is possible to create season within these dates
        const seasonsQuery = await supabase.from('seasons').select();
        const seasonStartDate: Date = new Date(seasonStart);
        const seasonEndDate: Date = new Date(seasonEnd);
        let isOverlapDate: boolean = false;
        if (seasonsQuery.data != null) {
            seasonsQuery.data.forEach((d: Season) => {
                const seasonStart: Date = new Date(d.start_date);
                const seasonEnd: Date = new Date(d.end_date);

                // Season start for the new season is overlapping with another season
                if (seasonStartDate >= seasonStart && seasonStartDate <= seasonEnd) {
                    isOverlapDate = true;
                    alert("Start date overlapping with another season");
                    loading = false;
                }
                // Today is between start and end of the season => ongoing season
                if (seasonEndDate >= seasonStart && seasonEndDate <= seasonEnd) {
                    isOverlapDate = true;
                    alert("End date overlapping with another season");
                    loading = false;
                }
            });
        }

        // Create season and add to database
        if (!isOverlapDate) {
            try {
                // Create new season
                let newSeason: CreateSeason = {
                    name: seasonName,
                    start_date: seasonStart,
                    end_date: seasonEnd
                }
                const { error } = await supabase.from('seasons').insert(newSeason);

                if (error) {
                    alert(error.message);
                } else {
                    alert("New season created!");
                    location.reload();
                }
            } finally {
                loading = false;
            }
        }

		
	};
</script>

<div class="flex flex-row items-center space-x-4">
    <h2> Administrer sesonger </h2>
    <div class="hover:cursor-pointer" on:mouseup={() => showSeasons = !showSeasons }>
        {#if showSeasons}
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
{#if showSeasons}
    <div class="w-full bg-primary-color text-center">
        <h3> Eksisterende sesonger </h3>
        {#each allSeasons as season}
            <p> 
                {season.name}
                {#if season.sid == activeSeason?.sid}
                    (Aktiv)
                {/if}
            </p>
        {/each}

        <h3> Legg til ny sesong </h3>
        <form class="flex flex-col items-center justify-center" on:submit|preventDefault={handleSeasonCreation}>
            <div class="mb-6">
                <label for="seasonName" class="block mb-1"><h4>Sesong navn:</h4></label>
                <input type="text" id="seasonName" class="input" placeholder="Vinter 2024" bind:value={seasonName} required>
            </div>
            <div class="mb-6">
                <label for="seasonStart" class="block mb-1"><h4>Start tid:</h4></label>
                <input type="text" id="seasonStart" class="input" placeholder="YYYY-MM-DD hh:mm:ss" bind:value={seasonStart} required>
            </div> 
            <div class="mb-6">
                <label for="seasonEnd" class="block mb-1"><h4>Slutt tid:</h4></label>
                <input type="text" id="seasonEnd" class="input" placeholder="YYYY-MM-DD hh:mm:ss" bind:value={seasonEnd} required> 
            </div>
            <div class="mb-6 flex justify-center">
                <input 
                    type="submit" 
                    class="btn" 
                    value={loading ? 'Laster' : 'Lag ny sesong'}
                    disabled={loading} />
            </div>
        </form>
    </div>
{/if} -->
