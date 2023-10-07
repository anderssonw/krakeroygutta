<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { PageData } from './$types';
	import madsIrishSrc from '$lib/assets/speechbubble/madsBubble3.png';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer, FullTeam } from '$lib/types/newTypes';

	// Get server data
	export let data: PageData;
	$: ({ teams, players, season } = data);
	$: fullTeams = mapToFullTeam(teams ?? [], players ?? []);

	function mapToFullTeam(allTeams: Tables<'teams'>[], allPlayers: FullPlayer[]): FullTeam[] {
		let fullTeams: FullTeam[] = [];
		allTeams.map(team => {
			let filterPlayers: FullPlayer[] = allPlayers.filter(player => ((player.team_id == team.id) && (player.season_id == team.season_id)))
			let fullTeam: FullTeam = {
				season_id: team.season_id,
				color: team.color,
				name: team.name,
				players: filterPlayers
			}
			fullTeams.push(fullTeam);
		})
		return fullTeams;
	}

	const speechBubbleText: string[] = [
		'Her finner du lagene til årets futsal turnering.',
		'Alle lag skal møte opp i klær som tilsvarer lagets farge.',
		'Om du ikke har fargen tilgjengelig hjemme, så må du høre med andre om du kan låne.'
	];
</script>

{#if fullTeams}
	<div class="structure">
		<h1>Teams</h1>
		<RuleSpeechBubble imageSrc={madsIrishSrc} text={speechBubbleText} />

		{#each fullTeams as team}
			<div class="w-full border-b-4 py-8 edge-team-{team.color}">
				<h3 class="text-center mb-8">{team.name}</h3>

				<div class="grid grid-cols-2 tablet:grid-cols-4 gap-y-8">
					{#each team.players as player}
						<div class="flex justify-center">
							<Card player={player} card_size={CARD_SIZE.MEDIUM} season={season}/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}
