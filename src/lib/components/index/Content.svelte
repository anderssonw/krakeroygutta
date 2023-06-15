<script>
	import { goto } from '$app/navigation';
	import KrakeroyKommune from '$lib/shared/krakeroyKommune.svelte';
	import LargeLogo from '$lib/shared/largeLogo.svelte';
</script>

<div class="container mx-auto max-w-screen-lg flex flex-col items-center justify-center space-y-4 sm:space-y-8 lg:space-y-10">
	<LargeLogo />

	<div class="relative w-[80%] sm:w-[60%]">
		<KrakeroyKommune />

		<div
		class="absolute w-4/5 top-[10%] left-[10%] flex flex-col space-y-2 sm:space-y-6 lg:space-y-10"
		>
			<h2 class="font-bold text-center">Velkommen til Fantasy Futsal!</h2>
			<h3>
				Sesongen starter 1.desember og da vil du få muligheten til å bygge ditt
				eget lag.
			</h3>
			<h3>
				Den 24.desember 2023 braker det løs, både i Blomsterøyhallen og Casa
				Bjerkholt. Du må derfor være ferdig med å bygge laget ditt innen den
				tid.
			</h3>
			<h3 class="text-center pt-4 sm:pt-16 lg:pt-24">
				Masse lykke til med årets sesong!
			</h3>
			<h3 class="text-center">Spell og ha det gøy!</h3>
		</div>
	</div>

	<div class="relative w-[90%] sm:w-[60%]">
		<img src="scroll.png" alt="scroll" />

		<div
		class="absolute w-3/5 top-[20%] left-[20%] flex flex-col space-y-4 sm:space-y-6 lg:space-y-8"
		>
			<h2 class="font-bold text-center text-amber-900">Regler</h2>
			<h3 class="text-amber-900">
				<ol class="list-decimal list-inside">
					<li> Poengfordelingen lyder: 				
						<ul class="list-disc list-inside pl-4">
							<li> 3 poeng ved mål </li>
							<li> 2 poeng ved assist </li>
							<li> 1 poeng ved redning </li>
						</ul> 
					</li>
					<li>
						Kampens dommer velge å gi 1 - 3 poeng ved C-momenter (utenom Jørgen)
					</li>
					<li>
						Det skal konsumeres en enhet per kamp
					</li>
					<li>
						Jada jada ..
					</li>
				</ol>
			</h3>
		</div>
	</div>
</div>