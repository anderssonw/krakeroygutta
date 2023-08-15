<script lang="ts">
	import { goto } from "$app/navigation";

    let card_type: string = "bronze";
</script>

<div class="w-full h-full relative hover:scale-105 active:scale-100 hover:cursor-pointer group">
    <img src="/cards/{card_type}.png" alt="gold" class="group-hover:drop-shadow-{card_type}" />

    <div class="w-36 absolute top-[19.6%] right-[10%]">
        <img src="/profile/placeholder.png" alt="head" />
        <!-- <div class="absolute top-[94%] bg-gradient-to-t from-slate-950/25 to-transparent w-[100%] h-2"></div> -->
    </div>
    
    <!--
    <div class="w-full absolute top-[10%] right-[25%]">
        <p class="text-center text-primary-color text-5xl">50</p>
    </div>

    <div class="w-full absolute top-[54%]">
        <p class="text-center text-primary-color text-2xl">William Anderson</p>
    </div>

    <div class="w-full absolute top-[69%] right-[20%]">
        <p class="text-center text-primary-color text-xl">50 ATK</p>
    </div>
    -->
</div>