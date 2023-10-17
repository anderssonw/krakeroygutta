<script lang="ts">
	import type { MatchStatsTeam, PlayerWithStatCount } from '$lib/types/newTypes';
	import MatchCardTeamStatList from './MatchCardTeamStatList.svelte';

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

<div class="flex flex-col w-1/2 px-4 my-4">
	<div class="flex-flex-col w-full">
		<MatchCardTeamStatList
			playerStats={getPlayerStatsFromTeam(team, 'goals')}
			title="Antall mål"
			noValDesc="Ingen spillere har scoret :("
		/>
	</div>
	<div class="flex flex-col tablet:flex-row justify-between mt-4 flex-wrap gap-y-4">
		<div class="flex-flex-col tablet:w-[45%]">
			<MatchCardTeamStatList
				playerStats={getPlayerStatsFromTeam(team, 'assists')}
				title="Assists"
				noValDesc="Ingen spillere har gitt assist :("
			/>
		</div>
		<div class="flex-flex-col tablet:w-[45%]">
			<MatchCardTeamStatList
				playerStats={getPlayerStatsFromTeam(team, 'clutches')}
				title="C-momenter"
				noValDesc="Ingen spillere har hatt et c-moment :("
			/>
		</div>
	</div>
</div>
