alter table "public"."assists" drop constraint "assists_match_id_fkey";

alter table "public"."assists" drop constraint "assists_player_id_fkey";

alter table "public"."clutches" drop constraint "clutches_match_id_fkey";

alter table "public"."clutches" drop constraint "clutches_player_id_fkey";

alter table "public"."goals" drop constraint "goals_match_id_fkey";

alter table "public"."goals" drop constraint "goals_player_id_fkey";

drop view if exists "public"."matchstats_view";

drop view if exists "public"."team_with_players";

alter table "public"."assists" drop constraint "assists_pkey";

alter table "public"."clutches" drop constraint "clutches_pkey";

alter table "public"."goals" drop constraint "goals_pkey";

alter table "public"."bets_against" drop constraint "bets_against_pkey";

alter table "public"."teams_players" drop constraint "teams_players_pkey";

drop index if exists "public"."assists_pkey";

drop index if exists "public"."clutches_pkey";

drop index if exists "public"."goals_pkey";

drop index if exists "public"."bets_against_pkey";

drop index if exists "public"."teams_players_pkey";

drop table "public"."assists";

drop table "public"."clutches";

drop table "public"."goals";

create table "public"."matches_stats" (
    "match_id" bigint not null,
    "player_id" bigint not null,
    "goals" bigint not null default '0'::bigint,
    "assists" bigint not null default '0'::bigint,
    "clutches" bigint not null default '0'::bigint
);


alter table "public"."bets_against" drop column "id";

alter table "public"."teams_players" drop column "id";

CREATE UNIQUE INDEX matches_stats_pkey ON public.matches_stats USING btree (match_id, player_id);

CREATE UNIQUE INDEX bets_against_pkey ON public.bets_against USING btree (bet_id, user_id);

CREATE UNIQUE INDEX teams_players_pkey ON public.teams_players USING btree (player_id, team_id);

alter table "public"."matches_stats" add constraint "matches_stats_pkey" PRIMARY KEY using index "matches_stats_pkey";

alter table "public"."bets_against" add constraint "bets_against_pkey" PRIMARY KEY using index "bets_against_pkey";

alter table "public"."teams_players" add constraint "teams_players_pkey" PRIMARY KEY using index "teams_players_pkey";

alter table "public"."matches_stats" add constraint "matches_stats_match_id_fkey" FOREIGN KEY (match_id) REFERENCES matches(id) not valid;

alter table "public"."matches_stats" validate constraint "matches_stats_match_id_fkey";

alter table "public"."matches_stats" add constraint "matches_stats_player_id_fkey" FOREIGN KEY (player_id) REFERENCES players(id) not valid;

alter table "public"."matches_stats" validate constraint "matches_stats_player_id_fkey";

create or replace view "public"."match_with_teams" as  SELECT mat.id AS match_id,
    mat.season_id,
    jsonb_build_object('id', ht.id, 'name', ht.name, 'color', ht.color, 'players', ( SELECT array_agg(htp.player_id) AS array_agg
           FROM teams_players htp
          WHERE (ht.id = htp.team_id))) AS home_team,
    jsonb_build_object('id', at.id, 'name', at.name, 'color', at.color, 'players', ( SELECT array_agg(atp.player_id) AS array_agg
           FROM teams_players atp
          WHERE (at.id = atp.team_id))) AS away_team
   FROM ((matches mat
     JOIN teams ht ON ((mat.team_home_id = ht.id)))
     JOIN teams at ON ((mat.team_away_id = at.id)));


create or replace view "public"."player_match_stats" as  SELECT pla.id AS player_id,
    sta.match_id,
    mat.season_id,
    sta.goals,
    sta.assists,
    sta.clutches
   FROM ((players pla
     JOIN matches_stats sta ON ((pla.id = sta.player_id)))
     JOIN matches mat ON ((sta.match_id = mat.id)));


create or replace view "public"."team_with_players" as  SELECT tea.season_id,
    tea.color,
    tea.name,
    jsonb_agg(jsonb_build_object('id', pla.id, 'name', pla.name, 'image', pla.image, 'attack', pls.attack, 'defence', pls.defence, 'physical', pls.physical, 'morale', pls.morale, 'price', pls.price)) AS players
   FROM (((teams tea
     JOIN teams_players tp ON ((tea.id = tp.team_id)))
     JOIN players pla ON ((tp.player_id = pla.id)))
     JOIN players_seasons pls ON ((pla.id = pls.player_id)))
  WHERE (tea.season_id = pls.season_id)
  GROUP BY tea.season_id, tea.color, tea.name;



