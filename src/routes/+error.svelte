<script lang="ts">
	import { page } from '$app/stores';
	import MadsSpeechBubble from '$lib/components/MadsSpeechBubble.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const errorMessages: Record<number, { title: string; message: string; mads: 'fiesta' | 'pirate' | 'irish' | 'classic' }> = {
		404: {
			title: 'Siden finnes ikke',
			message: 'Oi! Denne siden har visst tatt seg en pause. Kanskje den er på treningstur?',
			mads: 'irish'
		},
		500: {
			title: 'Noe gikk galt',
			message: 'Oisann! Noe gikk skikkelig galt her. Det er ikke din feil, det er våres! Eller kanskje det var Jørgen sin feil, hvem vet?',
			mads: 'pirate'
		},
		403: {
			title: 'Ingen tilgang',
			message: 'Hallo! Du har ikke lov til å være her. Dette er bare for de spesielle!',
			mads: 'classic'
		}
	};

	const statusCode = $derived($page.status);
	const errorInfo = $derived(
		errorMessages[statusCode] || {
			title: 'Ups, noe gikk galt!',
			message: 'Vi har desverre støtt på et problem. Prøv igjen senere!',
			mads: 'fiesta' as const
		}
	);
</script>

<div class="mt-24 flex items-center justify-center p-4">
	<div class="max-w-3xl space-y-8">
		<div class="text-center">
			<h1 class="mb-2 text-8xl font-bold text-slate-200">{statusCode}</h1>
			<h2 class="text-3xl font-semibold text-slate-300">{errorInfo.title}</h2>
		</div>

		<div class="flex justify-center">
			<div class="w-full max-w-2xl">
				<MadsSpeechBubble madsVersion={errorInfo.mads}>
					<p class="text-lg leading-relaxed text-gray-100">
						{errorInfo.message}
						<br /><br />
						{#if $page.error?.message}
							<span class="text-sm text-gray-300 italic">Teknisk info, vis gjerne til Magnus eller William: </span>
							<br />
							<span class="text-xs text-gray-300">{$page.error.message}</span>
						{/if}
					</p>
				</MadsSpeechBubble>
			</div>
		</div>

		<div class="flex justify-center gap-4">
			<Button href="/" variant="default" class="bg-slate-700 text-white hover:bg-slate-600">Tilbake til forsiden</Button>
			<Button onclick={() => window.history.back()} variant="outline" class="border-slate-600  hover:bg-slate-800">Gå tilbake</Button>
		</div>
	</div>
</div>
