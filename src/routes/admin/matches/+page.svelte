<script lang="ts">
	import DropdownMenu from "$lib/components/admin/dropdownMenu.svelte";
	import type { DropdownOption } from "$lib/types/newTypes";
    import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
    import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
    import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';

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

<div class="structure">
    <h3> Legg til nytt resultat </h3>

    <form class="w-full grid grid-cols-1 tablet:grid-cols-2 gap-4" method="POST">

        <div>
            <div class="form-structure">
                <DropdownMenu header={"Lag"} option={"team"} options={dropdownOptions} bind:selectedOption={teamOption1}/>

                <div class="border-2 p-4 w-full rounded-lg">
                    <p class="text-center"> Magnus Gulbrandsen </p>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="flex flex-row items-center">
                            <img class="w-6/12" src={goalIcon} alt="win" />
                            <input type="text" name="t1p1_goals" class="input w-6/12" />
                        </div>
                        <div class="flex flex-row items-center">
                            <img class="w-6/12" src={assistIcon} alt="win" />
                            <input type="text" name="t1p1_assist" class="input w-6/12" />
                        </div>
                        <div class="flex flex-row items-center">
                            <img class="w-6/12" src={clutchIcon} alt="win" />
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
</div>