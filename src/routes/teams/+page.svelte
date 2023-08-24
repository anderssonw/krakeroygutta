<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';

	// Get server data
	export let data: PageData;
	$: ({ session, teams } = data);

	// Protect route
	onMount(async () => {
		if (!session) {
			goto('/login');
		}
	});
</script>

{#if session && teams}
	<div class="structure">
		<h2>Teams</h2>

		{#each teams as team}
			<div class="w-full bg-primary-color-light">
				<h3 class="text-center">Team - {team.color}</h3>

				<div class="flex flex-row">
					<div class="w-1/2">
						<img src="/red_team.png" alt="red team" />
					</div>

					<div class="w-1/2 flex flex-wrap">
						<!-- TODO Get players here -->
						<!-- {#each getTeamPlayers(team.players) as player}
							<div class="w-1/2 h-1/2">
								<div class="small-card group aboslute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
									<CardSmallInfo {player} isCaptain={false} />
								</div>
							</div>
						{/each} -->
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="structure">
		<h2 class="text-center">Redirecting .. <SpinnerIcon /></h2>
	</div>
{/if}
