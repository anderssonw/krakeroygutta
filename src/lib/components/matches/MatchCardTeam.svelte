<script lang="ts">
	import type { MatchStatsTeam, PlayerWithStatCount } from '$lib/types/newTypes';

	import MatchCardTeamHeader from './MatchCardTeamHeader.svelte';
	import MatchCardTeamStatList from './MatchCardTeamStatList.svelte';

	export let mirror: boolean = false;
	export let team: MatchStatsTeam;

	interface PlayerStats {
		goals: number;
		assists: number;
		clutches: number;
	}

	const getPlayerStatsFromTeam = (team: MatchStatsTeam, statType: keyof PlayerStats): PlayerWithStatCount[] => {
		const playerStats: PlayerWithStatCount[] = [];

		team.players.forEach((player) => {
			playerStats.push({
				name: player.name,
				count: player[statType]
			});
		});

		return playerStats;
	};
</script>

<div class="flex flex-col">
	<MatchCardTeamHeader {team} {mirror} />
	<div class="flex-flex-col">
		<MatchCardTeamStatList
			playerStats={getPlayerStatsFromTeam(team, 'goals')}
			title="Antall mål"
			noValDesc="Ingen spillere har scoret :("
		/>
	</div>
	<div class="flex flex-row justify-between mt-4">
		<div class="flex-flex-col w-2/5">
			<MatchCardTeamStatList
				playerStats={getPlayerStatsFromTeam(team, 'assists')}
				title="Assists"
				noValDesc="Ingen spillere har gitt assist :("
			/>
		</div>
		<div class="flex-flex-col w-2/5">
			<MatchCardTeamStatList
				playerStats={getPlayerStatsFromTeam(team, 'clutches')}
				title="C-momenter"
				noValDesc="Ingen spillere har hatt et c-moment :("
			/>
		</div>
	</div>
</div>
