<script lang="ts">
	import AdminDropdown from "$lib/shared/AdminDropdown.svelte";
	import type { DropdownOption } from "$lib/types/newTypes";
	import DropdownMenu from "./dropdownMenu.svelte";

    let showMatches: boolean = false;

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
    let teamOption1: DropdownOption = {} as DropdownOption;
    let teamOption2: DropdownOption = {} as DropdownOption;
</script>

<AdminDropdown title={'kamper'} bind:showContent={showMatches} />

{#if showMatches}
        <h3> Legg til nytt resultat </h3>

        <form class="w-full grid grid-cols-1 tablet:grid-cols-2 gap-4" method="POST">

            <div>
                <div class="form-structure">
                    <DropdownMenu header={"Lag"} option={"team"} options={dropdownOptions} bind:selectedOption={teamOption1}/>

                    <div class="border-2 p-4 w-full rounded-lg">
                        <p class="text-center"> Magnus Gulbrandsen </p>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/win_icon.png" alt="win" />
                                <input type="text" name="t1p1_goals" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/assist_icon.png" alt="win" />
                                <input type="text" name="t1p1_assist" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/clutch_icon.png" alt="win" />
                                <input type="text" name="t1p1_clutch" class="input w-6/12" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="submit" class="btn" value={'Lag ny sesong'} />
                    </div>
                </div>
            </div>

        </form>
{/if}
