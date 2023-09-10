<script lang="ts">
	import TeamKit from '$lib/components/common/TeamKit.svelte';
    import MatchStatRow from '$lib/components/matches/MatchStatRow.svelte';
	import type { MatchDisplay, PlayerStats, TeamDisplay } from '$lib/types/newTypes';
	import type { PageData } from './$types';

	// Get server data
	export let data: PageData;
	$: ({ matches, teams } = data);

    // Mappings
    function mapTeam(team_id: number, g_pids: number[], a_pids: number[], c_pids: number[]): TeamDisplay {
        // Find team
        let specificTeam = teams?.filter(team => team.id == team_id);
        if(specificTeam){
            // Map team
            let team = specificTeam[0];
            let teamDisplay: TeamDisplay = {
                color: team.color,
                name: team.name,
                players: team.teams_players
                    .map(tp => {
                        if (tp.players) {
                            let player = tp.players;
                            let statPlayer: PlayerStats = {
                                player_id: player.id,
                                name: player.name,
                                goals: g_pids.filter((pid:number) => pid == player.id).length,
                                assists: a_pids.filter((pid:number) => pid == player.id).length,
                                clutches: c_pids.filter((pid:number) => pid == player.id).length
                            }
                            return statPlayer
                        } else {
                            return {} as PlayerStats;
                        }
                    })
                    .filter(p => Object.keys(p).length !== 0)
            }
            return teamDisplay;
        }
        return {} as TeamDisplay;
    }
    function mapMatches(): MatchDisplay[] {
        let mappedMatches = matches?.map(match => {
            let g_pid = match.goals.map(goal => goal.player_id);
            let a_pid = match.assists.map(assist => assist.player_id);
            let c_pid = match.clutches.map(clutch => clutch.player_id);

            let matchDisplay: MatchDisplay = {
                match_id: match.id,
                home_team: mapTeam(match.team_home_id, g_pid, a_pid, c_pid),
                away_team: mapTeam(match.team_away_id, g_pid, a_pid, c_pid)
            }

            return matchDisplay;
        })
        return (mappedMatches ? mappedMatches : [])
    } 
    function getGoalScore(match: MatchDisplay, home_team: boolean): number {
        let team: TeamDisplay = (home_team ? match.home_team : match.away_team);
        return team.players.reduce((a: number, b: PlayerStats) => a + b.goals, 0);
    }
</script>

<div class="structure">
    <h1> Kamper </h1>

    {#each mapMatches() as match}

        <h3> Kamp {match.match_id} </h3>

        <div class="w-full flex flex-col space-y-4 laptop:space-y-8 border-y-2 laptop:border-4 bg-primary-color border-secondary-color-light laptop:rounded-lg p-4">
            
            <div class="flex flex-row justify-around items-center">
                <div class="w-20 tablet:w-24 laptop:w-32 tablet:h-24 laptop:h-32">
                    <div class="flex flex-col items-center">
                        <TeamKit color={match.home_team.color} />
                        <h3> {match.home_team.name} </h3>
                    </div>
                </div>
                <h1> vs </h1>
                <div class="w-20 tablet:w-24 laptop:w-32 tablet:h-24 laptop:h-32">
                    <div class="flex flex-col items-center">
                        <TeamKit color={match.away_team.color} />
                        <h3> {match.away_team.name} </h3>
                    </div>
                </div>
            </div>
    
            <div class="flex flex-row justify-center items-center space-x-12">
                <h1> {getGoalScore(match, true)} </h1>
                <h1> - </h1>
                <h1> {getGoalScore(match, false)} </h1>
            </div>

            <MatchStatRow match={match} stat_type="goal" />
            <MatchStatRow match={match} stat_type="assist" />
            <MatchStatRow match={match} stat_type="clutch" />

        </div>
        
    {/each}

</div>
