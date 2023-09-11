<script lang="ts">
    import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
    import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
    import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';
    import winIcon from '$lib/assets/stat_icons/win_icon.png';
    import cleansheetIcon from '$lib/assets/stat_icons/cleansheet_icon.png';

    export let amount: number;
    export let large: boolean;
    export let icon: string;

    function getImage(icon: string) {
        if (icon == 'goal') return goalIcon;
        if (icon == 'assist') return assistIcon;
        if (icon == 'clutch') return clutchIcon;
        if (icon == 'win') return winIcon;
        if (icon == 'cleansheet') return cleansheetIcon;
        return '';
    }
</script>

<div class="flex flex-row items-center justify-center">
    <img class={large ? 'w-16' : 'w-8'} src={getImage(icon)} alt="goal" />
    <div class={large ? 'text-5xl' : 'text-2xl'}>{amount}</div>
</div>