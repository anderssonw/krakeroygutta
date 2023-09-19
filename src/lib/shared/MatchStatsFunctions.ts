import type { Tables } from "$lib/types/database.helper.types"
import type { MatchStatsQuery, MatchStatsTeam } from "$lib/types/newTypes"

export function mapTeamStats(matches: Tables<'matches'>[], teamStats: MatchStatsTeam[]): MatchStatsQuery[] {
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