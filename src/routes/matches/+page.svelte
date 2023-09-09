<script lang="ts">
	import SpinnerIcon from '$lib/components/common/spinnerIcon.svelte';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ session } = data);

    /* Information to fetch: */
    /* Match statistics - goalscorers, assists and clutch (match score comes from this) */
    /* Teams that participated in the match - need the team color and name */
    /* Combine the information into a type/interface, f.ex; Match  */
    /* Loop over the list of matches (Match[]) to display all matches for that season  */
</script>

<div class="structure">
    {#if session}
        <h1> Kamper </h1>

        <h3> Kamp 1 </h3>

        <div class="w-full flex flex-col space-y-4 laptop:space-y-8 border-y-2 laptop:border-4 bg-primary-color border-secondary-color-light laptop:rounded-lg p-4">

            <div class="flex flex-row justify-around items-center">
                <div class="w-20 tablet:w-24 laptop:w-32 h-20 tablet:h-24 laptop:h-32 bg-secondary-color"></div>
                <h1> vs </h1>
                <div class="w-20 tablet:w-24 laptop:w-32 h-20 tablet:h-24 laptop:h-32 bg-secondary-color"></div>
            </div>

            <div class="flex flex-row justify-center items-center space-x-12">
                <h1> 3 </h1>
                <h1> - </h1>
                <h1> 1 </h1>
            </div>
            
            <div class="flex flex-row justify-center items-center border-b-2 laptop:border-b-4">
                <div class="w-5/12 p-2 text-center">
                    <h5> Magnus Gulbrandsen x2 </h5>
                    <h5> Hans Langvik </h5>
                </div>
                <div class="w-2/12 flex justify-center">
                    <div class="w-24">
                        <img src="/stat_icons/goal_icon.png" alt="goal"/>
                    </div>
                </div>
                <div class="w-5/12 p-2 text-center">
                    <h5> Gauslaa </h5>
                </div>
            </div>

            <div class="flex flex-row justify-center items-center border-b-2 laptop:border-b-4">
                <div class="w-5/12 p-2 text-center">
                    <h5> Hans Langvik x2 </h5>
                </div>
                <div class="w-2/12 flex justify-center">
                    <div class="w-24">
                        <img src="/stat_icons/assist_icon.png" alt="assist"/>
                    </div>
                </div>
                <div class="w-5/12 p-2 text-center">

                </div>
            </div>

            <div class="flex flex-row justify-center items-center">
                <div class="w-5/12 p-2 text-center">
                    <h5> Magnus Gulbrandsen x10 </h5>
                    <h5> Hans Langvik x5 </h5>
                </div>
                <div class="w-2/12 flex justify-center">
                    <div class="w-24">
                        <img src="/stat_icons/clutch_icon.png" alt="clutch"/>
                    </div>
                </div>
                <div class="w-5/12 p-2 text-center">
                    <h5> Elias Gauslaa x5 </h5>
                </div>
            </div>

        </div>
    {:else}
        <h1> Redirecting .. <SpinnerIcon /> </h1>
    {/if}
</div>
