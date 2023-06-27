<script lang="ts">
    import type { Season } from "$lib/types/newTypes";

    export let activeSeason: Season | null;
    export let allSeasons: Season[];

    let showSeasons: boolean = false;
    let showTeams: boolean = false;
</script>


<div class="structure">
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
            Vinter 2021 (UTLØPT) <br/>
            Vinter 2022 (AKTIV) <br/>
            <h3> Legg til ny sesong </h3>
            <div class="flex flex-col items-center justify-center">
                Name:
                <input type="text" class="input" placeholder="Vinter 2024" />
                Start dato:
                <input type="text" class="input" placeholder="YYYY-MM-DD hh:mm:ss" />
                Slutt dato:
                <input type="text" class="input" placeholder="YYYY-MM-DD hh:mm:ss" />
                <button class="btn">Legg til</button>
            </div>
        </div>
    {/if}

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
            <h3> Eksisterende lag (for aktiv sesong) </h3>
            Lag rød (William, Johan) <br/>
            Lag blå (Mads, Magnus) <br/>
            <h3> Legg til nytt lag </h3>
            <div class="flex flex-col items-center justify-center">
                Name:
                <input type="text" class="input" placeholder="Vinter 2024" />
                4 DROPDOWNS HVOR ALLE MÅ HA EN SPILLER <br/>
                1 DROPDOWN HVOR MAN VELGER HVILKEN SESONG DET GJELDER
                <button class="btn">Legg til</button>
            </div>
        </div>
    {/if}

    <div class="relative">
        <div class="w-20 h-20 bg-primary-color-light origin-bottom-left absolute top-0"></div>
        <button class="btn">DROPDOWN</button>
    </div>
    

    <h2> If season, give points </h2>
    <div class="w-full h-96 bg-primary-color">

    </div>
</div>