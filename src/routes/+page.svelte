<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import headerLargeDisco from '$lib/assets/headerLargeDiscoDone.gif';
	import ruleScroll from '$lib/assets/ruleScroll.png';
	import { Button } from '$lib/components/ui/button';
	import squadLeft from '$lib/assets/SquadLeft.png';
	import squadRight from '$lib/assets/SquadRight.png';
	import KrakeroyKommune from '$lib/components/KrakeroyKommune.svelte';
	import { isSeasonFinished } from '$lib/season.js';

	let { data } = $props();
	let { season, profile } = $derived(data);

	let showSquadImages = $state(false);

	onMount(() => {
		const handleScroll = () => {
			const scrollHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY;
			const clientHeight = window.innerHeight;

			if (scrollTop + clientHeight >= scrollHeight - 100) {
				showSquadImages = true;
			} else {
				showSquadImages = false;
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const seasonFinished = $derived(isSeasonFinished(season));
</script>

<div class="container mx-auto my-8 flex flex-col items-center gap-8 px-4 md:px-16">
	<enhanced:img src={headerLargeDisco} alt="Header Large Disco" />
	{#if season}
		<div class="relative flex w-full justify-center sm:w-sm">
			<KrakeroyKommune className="fill-secondary"></KrakeroyKommune>

			<div class="absolute flex flex-col gap-4 px-8 pt-8 text-sm sm:text-base">
				<h2 class="text-center text-xl font-bold">Velkommen til Fantasy Futsal!</h2>

				{#if seasonFinished}
					<span>{season.name} er nå over. Takk for at du deltok! Vi håper å se deg igjen neste gang.</span>
					<span>I mellomtiden vil det være mulig å forrige sesongs resultater og statistikker ved å gå på Sesongoversikten.</span>
				{:else}
					<span>
						Fra og med {season.start_time.toLocaleDateString('no-NO', { dateStyle: 'long' })} vil det være mulig å opprette ditt helt egne fantasylag.
					</span>
					<span>
						Den {season.deadline_time.toLocaleDateString('no-NO', { dateStyle: 'long' })} braker det løs, både i hallen på Kvernhuset og Casa
						Bjerkholt. Klokken {season.deadline_time.toLocaleTimeString('no-NO', { timeStyle: 'short' })} samme dag vil det ikke lenger være mulig
						å endre på laget sitt.
					</span>
				{/if}
				<div class="flex flex-col items-center sm:mt-16">
					<span class="text-lg font-bold">Spell og ha det gøy!</span>
					<span class="text-xs font-light">Kråkerøygutt, hei, hei, hei!</span>
				</div>
			</div>
		</div>
		{#if !seasonFinished}
			<div class="flex justify-center">
				<div class="relative inline-block font-serif text-xs text-amber-700 italic text-shadow-black/10 text-shadow-xs">
					<enhanced:img src={ruleScroll} alt="Rule Scroll" />

					<div class="absolute inset-0 overflow-hidden p-8 sm:pt-24">
						<h2 class="text-center text-xl font-bold sm:mb-4">Regler</h2>
						<ol class="list-inside list-decimal sm:space-y-2">
							<li>
								Poengfordelingen lyder
								<ul class="list-inside list-disc pl-4">
									<li>{season.points_per_win} ved seier</li>
									<li>{season.points_per_goal} ved mål</li>
									<li>{season.points_per_assist} ved assist</li>
									<li>{season.points_per_clean_sheet} ved clean sheet</li>
									<li>{season.points_per_clutch} ved c-moment</li>
								</ul>
							</li>
							<li>
								Alle skal ha en keeper, som rullerer. Dersom det ikke er nok spillere til at laget kan være 4 på banen og ha en keeper, må
								keeper lånes fra andre lag.
							</li>
							<li>Alle lag skal ha en førings-ansvarlig som står ansvarlig for å føre all kampstatistikk, inkludert c-momenter.</li>
							<li>Det skal etter beste evne konsumeres én enhet a 0.33L ved hver kamp spilt. Husk at banespy fort gjelder som c-moment!</li>
							<li>Når du velger laget ditt må du også velge kaptein. Kapteinen din vil få doblet score blant alle poenggivninger</li>
						</ol>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	<Button href={profile ? `/sesong` : '/login'} variant="outline" class="flex w-32 justify-self-center">Kom i gang!</Button>
</div>

{@render squadImage(squadLeft, 'Squad Left', 'left')}
{@render squadImage(squadRight, 'Squad Right', 'right')}

{#snippet squadImage(src: string, alt: string, side: 'left' | 'right')}
	<enhanced:img
		{src}
		{alt}
		class={cn(
			'fixed bottom-0',
			side === 'left' ? 'left-0' : 'right-0',
			'w-32 sm:w-48 md:w-64 lg:w-80',
			'transition-transform duration-500 ease-in-out',
			showSquadImages ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
		)}
	/>
{/snippet}
