drop view if exists "public"."team_with_players";

create or replace view "public"."fantasy_with_players" as  SELECT fat.id AS fantasy_team_id,
    fat.season_id,
    fat.user_id,
    fat.name,
    fat.captain_id,
    array_agg(fap.player_id) AS player_ids
   FROM (fantasy_teams fat
     JOIN fantasy_teams_players fap ON ((fat.id = fap.fantasy_team_id)))
  GROUP BY fat.id;


create or replace view "public"."player_season_stats" as  SELECT pla.id AS player_id,
    pla.name,
    pla.image,
    pls.season_id,
    pls.attack,
    pls.defence,
    pls.physical,
    pls.morale,
    pls.price,
    tea.color AS team_color,
    tea.id AS team_id
   FROM (((players pla
     JOIN players_seasons pls ON ((pla.id = pls.player_id)))
     JOIN teams_players tp ON ((pla.id = tp.player_id)))
     JOIN teams tea ON ((tp.team_id = tea.id)))
  WHERE (pls.season_id = tea.season_id);



