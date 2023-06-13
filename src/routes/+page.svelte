<script>
	import KrakeroyKommune from '$lib/shared/krakeroyKommune.svelte';
</script>
  
<div class="container mx-auto max-w-screen-lg">
	<div>
		<img src="logo.png" alt="logo" />
	</div>

	<div class="relative mx-auto max-w-[75%]">
		<KrakeroyKommune />
		<div
		class="absolute w-4/5 top-[10%] left-[10%] flex flex-col space-y-4 sm:space-y-8 lg:space-y-10"
		>
		<h1 class="font-bold">Velkommen til Fantasy Futsal!</h1>
		<h2>
			Sesongen starter 1.desember og da vil du få muligheten til å bygge ditt
			eget lag.
		</h2>
		<h2>
			Den 24.desember 2023 braker det løs, både i Blomsterøyhallen og Casa
			Bjerkholt. Du må derfor være ferdig med å bygge laget ditt innen den
			tid.
		</h2>
		<h2 class="text-center pt-8 sm:pt-28 lg:pt-32">
			Masse lykke til med årets sesong!
		</h2>
		<h2 class="text-center">Spell og ha det gøy!</h2>
		</div>
	</div>

	<div class="relative mx-auto w-3/6 h-80">
	</div>
</div>

<div class="relative h-60 w-full">
	<div class="absolute left-0 bottom-0 w-2/6">
		<img src="SquadLeft.png" alt="left squad" />
	</div>
	<div class="flex flex-col justify-center items-center h-[100%]">
		<h3>Hvem tar du med deg?</h3>
		<button
		class="bg-primary-color-light hover:bg-primary-color text-secondary-color font-bold py-2 px-4 rounded shadow"
		>
		Kom i gang!
		</button>
	</div>
	<div class="absolute right-0 bottom-0 w-2/6">
		<img src="SquadRight.png" alt="right squad" />
	</div>
</div>
