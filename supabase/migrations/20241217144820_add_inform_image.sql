drop view if exists "public"."player_season_stats";

alter table "public"."players_seasons" add column "inform_image" text;

create or replace view "public"."player_season_stats" as  SELECT pla.id AS player_id,
    pla.name,
    pla.image,
    pls.season_id,
    pls.attack,
    pls.defence,
    pls.physical,
    pls.morale,
    pls.skill,
    pls.price,
    pls.inform_image,
    tea.color AS team_color,
    tea.id AS team_id
   FROM (((players pla
     JOIN players_seasons pls ON ((pla.id = pls.player_id)))
     JOIN teams_players tp ON ((pla.id = tp.player_id)))
     JOIN teams tea ON ((tp.team_id = tea.id)))
  WHERE (pls.season_id = tea.season_id);



