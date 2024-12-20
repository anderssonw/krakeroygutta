import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { MatchStatsTeam, MatchesWithSeasonName, StandardPlayer } from '$lib/types/newTypes';

export const load = (async ({ locals: { supabase }, url }) => {

    const getSeasons = async () => {
        const { data: seasons, error: seasonsError } = await supabase.from('seasons').select();

        if (seasonsError) {
            throw error(500, {
                message: seasonsError.message,
                devHelper: '/statistics getting seasons'
            });
        }

        return seasons;
    }

    const getPlayers = async () => {
        const { data: players, error: playersError } = await supabase
            .from('players_seasons')
            .select('...players(id, name, image)')
            .returns<StandardPlayer[]>();

        if (playersError) {
            throw error(500, {
                message: playersError.message,
                devHelper: '/statistics getting matches'
            });
        }
        
        return players;
    };

    const getMatchesForSeason = async () => {
        const { data: matches, error: matchesError } = await supabase
            .from('matches')
            .select(
                `
                        *,
                        season_name:seasons(name)
                    `
            )
            .returns<MatchesWithSeasonName[]>();

        if (matchesError) {
            throw error(500, {
                message: matchesError.message,
                devHelper: '/statistics getting matches'
            });
        }

        return matches;
    };

    const getTeamStatsSeason = async () => {
        const { data: teamStats, error: teamStatsError } = await supabase
            .from('team_with_stats')
            .select(
                `
                    *
                `
            )
            .returns<MatchStatsTeam[]>();

        if (teamStatsError) {
            throw error(500, {
                message: teamStatsError.message,
                devHelper: '/team_with_stats getting team with player stats - view'
            });
        }

        return teamStats;
    };

    return {
        seasons: await getSeasons(),
        players: await getPlayers(),
        allMatches: await getMatchesForSeason(),
        teamStats: await getTeamStatsSeason(),
    };
}) satisfies PageServerLoad;
