<script lang="ts">
	import madsFiesta from '$lib/assets/speechbubble/madsBubble1.png';
	import madsPirate from '$lib/assets/speechbubble/madsBubble2.png';
	import madsIrish from '$lib/assets/speechbubble/madsBubble3.png';
	import madsClassic from '$lib/assets/speechbubble/madsBubble4.png';

	type Props = {
		madsVersion: 'fiesta' | 'pirate' | 'irish' | 'classic';
	};

	let { madsVersion }: Props = $props();

	const madsBubble = $derived.by(() => {
		switch (madsVersion) {
			case 'fiesta':
				return madsFiesta;
			case 'pirate':
				return madsPirate;
			case 'irish':
				return madsIrish;
			case 'classic':
			default:
				return madsClassic;
		}
	});
</script>

<div class="relative flex flex-row items-center justify-center gap-4">
	<div class="h-32 w-32 shrink-0">
		<img src={madsBubble} alt="Mads" class="h-full w-full object-contain" />
	</div>
	<div class="relative max-w-lg rounded-xl bg-slate-600 p-4 shadow-2xl">
		<div
			class="absolute top-1/2 -left-2 h-0 w-0 -translate-y-1/2 transform border-t-10 border-r-10 border-b-10 border-t-transparent border-r-slate-600 border-b-transparent"
		></div>
		<p class="text-xs leading-relaxed text-gray-100">
			Alle spillere er vurdert relativt til ferdighetene som befinner seg i gjengen.
			<br /><br />
			Vurderingen er gjort av komiteen og trengs ikke diskuteres ytterligere.
			<br /><br />
			Ferdighetene er IKKE endelige og kan endre seg fra sesong til sesong basert på egen utvikling. Innenfor en sesong er dog ferdigheter endelige.
		</p>
	</div>
</div>
