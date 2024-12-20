<script lang="ts">
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
	import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
	import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';
	import winIcon from '$lib/assets/stat_icons/win_icon.png';
	import cleanIcon from '$lib/assets/stat_icons/cleansheet_icon.png';
	import type { PlayerStatsSeasonSummary } from '$lib/types/newTypes';
    
	export let player: PlayerStatsSeasonSummary;
</script>

<div class="grid grid-cols-10 tablet:grid-cols-8 bg-primary-color pr-4">
    <div class="col-span-4 tablet:col-span-2">
        <div class="flex flex-row items-center">
            <img class="bg-white rounded-full p-2 mx-4 my-2 w-8 h-8 tablet:w-12 tablet:h-12" src={player.player_image} alt="Player" />
            <div class="mr-4">
                <p class="font-semibold text-xs tablet:text-xl">
                    {player.player_name.split(' ')[player.player_name.split(' ').length - 1]}
                </p>
            </div>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <img class="w-4 h-4 tablet:w-6 tablet:h-6" src={goalIcon} alt="goal" />
            <p class="text-xs tablet:text-xl font-semibold">{player.goals}</p>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <img class="w-4 h-4 tablet:w-6 tablet:h-6" src={assistIcon} alt="assist" />
            <h3 class="text-xs tablet:text-xl font-semibold">{player.assists}</h3>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <img class="w-4 h-4 tablet:w-6 tablet:h-6" src={clutchIcon} alt="clutch" />
            <h3 class="text-xs tablet:text-xl font-semibold">{player.clutches}</h3>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <img class="w-4 h-4 tablet:w-6 tablet:h-6" src={winIcon} alt="wins" />
            <h3 class="text-xs tablet:text-xl font-semibold">{player.wins}</h3>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <img class="w-4 h-4 tablet:w-6 tablet:h-6" src={cleanIcon} alt="clean sheets" />
            <h3 class="text-xs tablet:text-xl font-semibold">{player.clean_sheets}</h3>
        </div>
    </div>
    <div class="col-span-1 flex items-center justify-end">
        <div class="flex flex-row items-center">
            <h3 class="text-xs tablet:text-xl font-semibold">{player.points}p</h3>
        </div>
    </div>
</div>