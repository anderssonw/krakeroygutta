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
		allTeams.map((team) => {
			let filterPlayers: FullPlayer[] = allPlayers.filter((player) => player.team_id == team.id && player.season_id == team.season_id);
			let fullTeam: FullTeam = {
				season_id: team.season_id,
				color: team.color,
				name: team.name,
				players: filterPlayers
			};
			fullTeams.push(fullTeam);
		});
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

		{#if fullTeams.length > 0}
			{#each fullTeams as team}
				<div class="w-full border-b-4 py-8 edge-team-{team.color}">
					<h2 class="text-center mb-8">{team.name}</h2>

					<div class="flex flex-row justify-around flex-wrap">
						{#each team.players as player}
							<div class="flex justify-center">
								<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />
							</div>
						{/each}
					</div>
				</div>
			{/each}
		{:else}
			<div class="p-8 tablet:p-4 laptop:p-0">
				<h5>Det er ikke blitt satt opp noen lag for årets sesong enda.</h5>
				<h5>Fortvil ikke! Julebordskomiteen jobber iherdig med å sette opp rettferdige lag i skrivende stund.</h5>
			</div>
		{/if}

	</div>
{/if}
