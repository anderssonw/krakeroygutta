<script lang="ts">
	import vsSrc from '$lib/assets/vs.png';

	export let score: string;
</script>

<div class="flex flex-col mx-6 items-center my-4 tablet:my-0">
	<img class="w-8" alt="Versus" src={vsSrc} />
	<div class="mt-4 w-16 text-center tracking-widest text-white font-bold italic bg-team-black rounded-lg">{score}</div>
</div>
