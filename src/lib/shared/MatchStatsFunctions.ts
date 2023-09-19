import type { Tables } from "$lib/types/database.helper.types"
import type { MatchStatsQuery, MatchStatsTeam, TeamWithStats } from "$lib/types/newTypes"

export const mapTeamStats = (matches: Tables<'matches'>[], teamStats: MatchStatsTeam[]): MatchStatsQuery[] => {
    if ((matches.length > 0) && (teamStats.length > 0)) {
        let matchStatsQueries: MatchStatsQuery[] = []
        matches.forEach(match => {
            let home_team = teamStats.find(ts => (ts.team_id == match.team_home_id))
            let away_team = teamStats.find(ts => (ts.team_id == match.team_away_id) && (ts.match_id == match.id))
            
            if(home_team && away_team) {
                let matchStatsQuery: MatchStatsQuery = {
                    match_id: match.id,
                    season_id: match.season_id,
                    home_team: home_team,
                    away_team: away_team
                }
                matchStatsQueries.push(matchStatsQuery)
            }
        })
        return matchStatsQueries;
    } else {
        return [];
    }
}

export const getTeamStatsFromMatches = (teams: Tables<'teams'>[], matches: MatchStatsQuery[] | null | undefined): TeamWithStats[] => {
    let teamStats: TeamWithStats[] = teams.map((team) => {
        return {
            team_id: team.id,
            wins: 0,
            losses: 0,
            draws: 0,
            color: team.color,
            name: team.name
        };
    });

    const getTeamStatsFromId = (team_id: number) => {
        return teamStats.find((team) => team.team_id === team_id);
    };

    if (!matches) return [];

    matches.forEach((match) => {
        let homeTeamGoals = match.home_team.players.reduce((goalSum, player) => {
            return goalSum + player.goals;
        }, 0);

        let awayTeamGoals = match.away_team.players.reduce((goalSum, player) => {
            return goalSum + player.goals;
        }, 0);

        let homeTeamStats = getTeamStatsFromId(match.home_team.team_id);
        let awayTeamStats = getTeamStatsFromId(match.away_team.team_id);

        if (!homeTeamStats) return;
        if (!awayTeamStats) return;

        if (homeTeamGoals === awayTeamGoals) {
            homeTeamStats.draws++;
            awayTeamStats.draws++;
        } else if (homeTeamGoals > awayTeamGoals) {
            homeTeamStats.wins++;
            awayTeamStats.losses++;
        } else if (awayTeamGoals > homeTeamGoals) {
            homeTeamStats.losses++;
            awayTeamStats.wins++;
        }

        return;
    });

    return teamStats;
};