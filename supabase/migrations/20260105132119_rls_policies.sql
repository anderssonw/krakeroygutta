-- Drop all views (no longer used)
DROP VIEW IF EXISTS "public"."bets_with_challengers";
DROP VIEW IF EXISTS "public"."fantasy_with_players";
DROP VIEW IF EXISTS "public"."player_season_stats";
DROP VIEW IF EXISTS "public"."team_with_stats";

-- Create helper function to check admin status (bypasses RLS to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    false
  );
$$;

-- Enable Row Level Security on all tables
ALTER TABLE "public"."bets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bets_against" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."clutches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."fantasy_teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."fantasy_teams_players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."matches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."players_seasons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."seasons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."teams_players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BETS TABLE POLICIES
-- ============================================================================

-- SELECT policy for bets (all authenticated users)
CREATE POLICY "bets_select_policy" ON "public"."bets"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for bets (users can create their own bets)
CREATE POLICY "bets_insert_policy" ON "public"."bets"
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE policy for bets (users can update their own bets)
CREATE POLICY "bets_update_policy" ON "public"."bets"
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- DELETE policy for bets (users can delete their own bets)
CREATE POLICY "bets_delete_policy" ON "public"."bets"
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- ============================================================================
-- BETS_AGAINST TABLE POLICIES
-- ============================================================================

-- SELECT policy for bets_against (all authenticated users)
CREATE POLICY "bets_against_select_policy" ON "public"."bets_against"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for bets_against (users can create their own bets against)
CREATE POLICY "bets_against_insert_policy" ON "public"."bets_against"
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE policy for bets_against (users can update their own bets against)
CREATE POLICY "bets_against_update_policy" ON "public"."bets_against"
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- DELETE policy for bets_against (users can delete their own bets against)
CREATE POLICY "bets_against_delete_policy" ON "public"."bets_against"
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- ============================================================================
-- CLUTCHES TABLE POLICIES
-- ============================================================================

-- SELECT policy for clutches (all authenticated users)
CREATE POLICY "clutches_select_policy" ON "public"."clutches"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for clutches (only admins)
CREATE POLICY "clutches_insert_policy" ON "public"."clutches"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for clutches (only admins)
CREATE POLICY "clutches_update_policy" ON "public"."clutches"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for clutches (only admins)
CREATE POLICY "clutches_delete_policy" ON "public"."clutches"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- FANTASY_TEAMS TABLE POLICIES
-- ============================================================================

-- SELECT policy for fantasy_teams (admins or own teams)
CREATE POLICY "fantasy_teams_select_policy" ON "public"."fantasy_teams"
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = user_id OR
        public.is_admin()
    );

-- INSERT policy for fantasy_teams (users can create their own teams)
CREATE POLICY "fantasy_teams_insert_policy" ON "public"."fantasy_teams"
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- UPDATE policy for fantasy_teams (users can update their own teams)
CREATE POLICY "fantasy_teams_update_policy" ON "public"."fantasy_teams"
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

-- DELETE policy for fantasy_teams (users can delete their own teams)
CREATE POLICY "fantasy_teams_delete_policy" ON "public"."fantasy_teams"
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);


-- ============================================================================
-- FANTASY_TEAMS_PLAYERS TABLE POLICIES
-- ============================================================================

-- SELECT policy for fantasy_teams_players (admins or own team's players)
CREATE POLICY "fantasy_teams_players_select_policy" ON "public"."fantasy_teams_players"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM fantasy_teams
            WHERE fantasy_teams.id = fantasy_teams_players.fantasy_team_id
            AND fantasy_teams.user_id = (SELECT auth.uid())
        ) OR
        public.is_admin()
    );

-- INSERT policy for fantasy_teams_players (users can add players to their own teams)
CREATE POLICY "fantasy_teams_players_insert_policy" ON "public"."fantasy_teams_players"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM fantasy_teams
            WHERE fantasy_teams.id = fantasy_teams_players.fantasy_team_id
            AND fantasy_teams.user_id = (SELECT auth.uid())
        )
    );

-- UPDATE policy for fantasy_teams_players (users can update players in their own teams)
CREATE POLICY "fantasy_teams_players_update_policy" ON "public"."fantasy_teams_players"
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM fantasy_teams
            WHERE fantasy_teams.id = fantasy_teams_players.fantasy_team_id
            AND fantasy_teams.user_id = (SELECT auth.uid())
        )
    );

-- DELETE policy for fantasy_teams_players (users can remove players from their own teams)
CREATE POLICY "fantasy_teams_players_delete_policy" ON "public"."fantasy_teams_players"
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM fantasy_teams
            WHERE fantasy_teams.id = fantasy_teams_players.fantasy_team_id
            AND fantasy_teams.user_id = (SELECT auth.uid())
        )
    );


-- ============================================================================
-- GOALS TABLE POLICIES
-- ============================================================================

-- SELECT policy for goals (all authenticated users)
CREATE POLICY "goals_select_policy" ON "public"."goals"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for goals (only admins)
CREATE POLICY "goals_insert_policy" ON "public"."goals"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for goals (only admins)
CREATE POLICY "goals_update_policy" ON "public"."goals"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for goals (only admins)
CREATE POLICY "goals_delete_policy" ON "public"."goals"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- MATCHES TABLE POLICIES
-- ============================================================================

-- SELECT policy for matches (all authenticated users)
CREATE POLICY "matches_select_policy" ON "public"."matches"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for matches (only admins)
CREATE POLICY "matches_insert_policy" ON "public"."matches"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for matches (only admins)
CREATE POLICY "matches_update_policy" ON "public"."matches"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for matches (only admins)
CREATE POLICY "matches_delete_policy" ON "public"."matches"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- PLAYERS TABLE POLICIES
-- ============================================================================

-- SELECT policy for players (all authenticated users)
CREATE POLICY "players_select_policy" ON "public"."players"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for players (only admins)
CREATE POLICY "players_insert_policy" ON "public"."players"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for players (only admins)
CREATE POLICY "players_update_policy" ON "public"."players"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for players (only admins)
CREATE POLICY "players_delete_policy" ON "public"."players"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- PLAYERS_SEASONS TABLE POLICIES
-- ============================================================================

-- SELECT policy for players_seasons (all authenticated users)
CREATE POLICY "players_seasons_select_policy" ON "public"."players_seasons"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for players_seasons (only admins)
CREATE POLICY "players_seasons_insert_policy" ON "public"."players_seasons"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for players_seasons (only admins)
CREATE POLICY "players_seasons_update_policy" ON "public"."players_seasons"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for players_seasons (only admins)
CREATE POLICY "players_seasons_delete_policy" ON "public"."players_seasons"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- SEASONS TABLE POLICIES
-- ============================================================================

-- SELECT policy for seasons (all authenticated users)
CREATE POLICY "seasons_select_policy" ON "public"."seasons"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for seasons (only admins)
CREATE POLICY "seasons_insert_policy" ON "public"."seasons"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for seasons (only admins)
CREATE POLICY "seasons_update_policy" ON "public"."seasons"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for seasons (only admins)
CREATE POLICY "seasons_delete_policy" ON "public"."seasons"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- TEAMS TABLE POLICIES
-- ============================================================================

-- SELECT policy for teams (all authenticated users)
CREATE POLICY "teams_select_policy" ON "public"."teams"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for teams (only admins)
CREATE POLICY "teams_insert_policy" ON "public"."teams"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for teams (only admins)
CREATE POLICY "teams_update_policy" ON "public"."teams"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for teams (only admins)
CREATE POLICY "teams_delete_policy" ON "public"."teams"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- TEAMS_PLAYERS TABLE POLICIES
-- ============================================================================

-- SELECT policy for teams_players (all authenticated users)
CREATE POLICY "teams_players_select_policy" ON "public"."teams_players"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for teams_players (only admins)
CREATE POLICY "teams_players_insert_policy" ON "public"."teams_players"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for teams_players (only admins)
CREATE POLICY "teams_players_update_policy" ON "public"."teams_players"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for teams_players (only admins)
CREATE POLICY "teams_players_delete_policy" ON "public"."teams_players"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());


-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- SELECT policy for users (all authenticated users)
CREATE POLICY "users_select_policy" ON "public"."users"
    FOR SELECT
    TO authenticated
    USING (true);

-- INSERT policy for users (only admins)
CREATE POLICY "users_insert_policy" ON "public"."users"
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- UPDATE policy for users (only admins)
CREATE POLICY "users_update_policy" ON "public"."users"
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- DELETE policy for users (only admins)
CREATE POLICY "users_delete_policy" ON "public"."users"
    FOR DELETE
    TO authenticated
    USING (public.is_admin());
