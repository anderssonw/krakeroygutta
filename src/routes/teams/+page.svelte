<script lang="ts">
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ teams } = data);
</script>

{#if teams}
	<div class="structure">
		<h2>Teams</h2>

		{#each teams as team}
			<div class="w-full bg-primary-color-light">
				<h3 class="text-center">Team - {team.color}</h3>

				<div class="flex flex-row">

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
{/if}
