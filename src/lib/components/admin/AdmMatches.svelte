<script lang="ts">
	import AdminDropdown from "$lib/shared/AdminDropdown.svelte";
    import TextField from "$lib/shared/TextField.svelte";
	import type { DropdownOption } from "$lib/types/newTypes";
	import DropdownMenu from "./dropdownMenu.svelte";

    let showMatches: boolean = true;

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
    let teamOption: DropdownOption = {} as DropdownOption;
</script>

<AdminDropdown title={'kamper'} bind:showContent={showMatches} />

{#if showMatches}
        <h3> Legg til nytt resultat </h3>

        <div class="w-full grid grid-cols-1 tablet:grid-cols-2 gap-4">

            <form method="POST">
                <div class="form-structure">
                    <DropdownMenu header={"Lag"} option={"team"} options={dropdownOptions} bind:selectedOption={teamOption}/>

                    <div class="border-2 p-4 w-full rounded-lg">
                        <p class="text-center"> Magnus Gulbrandsen </p>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/win_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/assist_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/clutch_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <input type="submit" class="btn" value={'Lag ny sesong'} />
                    </div>
                </div>
            </form>

            <form method="POST">
                <div class="form-structure">
                    <DropdownMenu header={"Lag"} option={"team"} options={dropdownOptions} bind:selectedOption={teamOption}/>
                    <div class="border-2 p-4 w-full rounded-lg">
                        <p class="text-center"> Magnus Gulbrandsen </p>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/win_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/assist_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                            <div class="flex flex-row items-center">
                                <img class="w-6/12" src="/stat_icons/clutch_icon.png" alt="win" />
                                <input type="text" class="input w-6/12" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="submit" class="btn" value={'Lag ny sesong'} />
                    </div>
                </div>
            </form>

        </div>
{/if}
