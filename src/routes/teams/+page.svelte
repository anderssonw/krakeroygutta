<script lang="ts">
	import Card from '$lib/components/cards/Card.svelte';
	import RuleSpeechBubble from '$lib/components/common/RuleSpeechBubble.svelte';
	import { CARD_SIZE } from '$lib/shared/playerCardFunctions';
	import type { PageData } from './$types';
	import madsIrishSrc from '$lib/assets/speechbubble/madsBubble3.png';
	import type { Tables } from '$lib/types/database.helper.types';
	import type { FullPlayer, FullTeam, MatchStatsTeam, PlayerIndividualStats } from '$lib/types/newTypes';
	import goalIcon from '$lib/assets/stat_icons/goal_icon.png';
	import assistIcon from '$lib/assets/stat_icons/assist_icon.png';
	import clutchIcon from '$lib/assets/stat_icons/clutch_icon.png';

	// Get server data
	export let data: PageData;
	$: ({ teams, players, season, teamStats } = data);
	$: player_stats = mapToPerPlayerStats(teamStats);
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

	function mapToPerPlayerStats(teamStats: MatchStatsTeam[] | undefined): Map<number, PlayerIndividualStats> | null {
		if (!teamStats) {
			return null;
		}

		const playerMap = new Map<number, PlayerIndividualStats>();

		teamStats?.map((team_stats) => {
			team_stats.players.map((player) => {
				const curPlayerStats: PlayerIndividualStats | undefined = playerMap.get(player.id);
				if (curPlayerStats) {
					const copyPlayer = { ...curPlayerStats };
					copyPlayer.goals += player.goals;
					copyPlayer.assists += player.assists;
					copyPlayer.clutches += player.clutches;
					playerMap.set(player.id, copyPlayer);
				} else {
					const createStats: PlayerIndividualStats = {
						player_id: player.id,
						goals: player.goals,
						assists: player.assists,
						clutches: player.clutches
					};
					playerMap.set(player.id, createStats);
				}
			});
		});

		return playerMap;
	}

	function getPlayerStats(pid: number) {
		if (player_stats) {
			const player: PlayerIndividualStats | undefined = player_stats.get(pid);
			if (player) {
				return player;
			}
		}
		const noPlayer: PlayerIndividualStats = {
			player_id: 0,
			goals: 0,
			assists: 0,
			clutches: 0
		};
		return noPlayer;
	}

	const speechBubbleText: string[] = [
		'Her finner du lagene til årets futsal turnering.',
		'Alle lag skal møte opp i klær som tilsvarer lagets farge.',
		'Om du ikke har fargen tilgjengelig hjemme, så må du høre med andre om du kan låne.',
		'Statistikken under hvert kort gjelder kun årets sesong. Om du ønsker å se totalen kan du gå inn på hver enkelt spiller.'
	];
</script>

{#if fullTeams}
	<div class="structure">
		<h1>Lag</h1>
		<RuleSpeechBubble imageSrc={madsIrishSrc} text={speechBubbleText} />

		{#if fullTeams.length > 0}
			{#each fullTeams as team}
				<div class="w-full border-b-4 py-8 edge-team-{team.color}">
					<h2 class="text-center mb-8">{team.name}</h2>

					<div class="flex flex-row justify-around flex-wrap">
						{#each team.players as player}
							<div class="flex flex-col justify-center gap-2">
								<Card {player} card_size={CARD_SIZE.MEDIUM} {season} />
								<div class="flex flex-row justify-between items-center">
									<div class="flex flex-row items-center">
										<img class="w-7 h-7" src={goalIcon} alt="goal" />
										<h2 class="font-semibold">{getPlayerStats(player.player_id).goals}</h2>
									</div>
									<div class="flex flex-row items-center">
										<img class="w-7 h-7" src={assistIcon} alt="goal" />
										<h2 class="font-semibold">{getPlayerStats(player.player_id).assists}</h2>
									</div>
									<div class="flex flex-row items-center">
										<img class="w-7 h-7" src={clutchIcon} alt="goal" />
										<h2 class="font-semibold">{getPlayerStats(player.player_id).clutches}</h2>
									</div>
								</div>
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
