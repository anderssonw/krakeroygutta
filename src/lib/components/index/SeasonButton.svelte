<script lang="ts">
    import { goto } from '$app/navigation';
    import betsBtn from '$lib/assets/season/bets_btn.png';
    import matchesBtn from '$lib/assets/season/matches_btn.png';
    import playersBtn from '$lib/assets/season/players_btn.png';
    import teamsBtn from '$lib/assets/season/teams_btn.png';

    export let image: string;
    export let text: string;

    function getImage(image: string) {
        if (image == 'players') return playersBtn;
        if (image == 'teams') return teamsBtn;
        if (image == 'matches') return matchesBtn;
        if (image == 'bets') return betsBtn;
        return '';
    }
</script>

<div 
    class="flex flex-col items-center group 
    hover:cursor-pointer hover:scale-105 active:scale-100 border-4 border-secondary-color-light rounded-3xl" on:mouseup={() => goto(`/${image.toLowerCase()}`)}>

    <img src={getImage(image)} alt="players" class="w-[80%] mb-2 group-hover:scale-105 group-active:scale-100" />
    <h1 class="mb-4 group-hover:scale-105 group-active:scale-100">{text}</h1>
</div>