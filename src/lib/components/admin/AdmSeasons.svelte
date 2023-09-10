<script lang="ts">
	import AdminDropdown from "$lib/shared/AdminDropdown.svelte";
    import TextField from "$lib/shared/TextField.svelte";

    let showSeasons: boolean = true;


</script>

<AdminDropdown title={'sesonger'} bind:showContent={showSeasons} />

{#if showSeasons}
        <h3> Legg til ny sesong </h3>

        <form class="form" method="POST" action="?/createSeason">
            <div class="form-structure">
                <TextField header="Sesong navn" label="seasonName" type="text" placeholder="Vinter 2024" />
                <TextField header="Start tid" label="seasonStart" type="text" placeholder="YYYY-MM-DD hh:mm:ss" />
                <TextField header="Deadline tid" label="seasonDeadline" type="text" placeholder="YYYY-MM-DD hh:mm:ss" />
                <TextField header="Slutt tid" label="seasonEnd" type="text" placeholder="YYYY-MM-DD hh:mm:ss" />
                <div>
                    <input type="submit" class="btn" value={'Lag ny sesong'} />
                </div>
            </div>
        </form>
{/if}
