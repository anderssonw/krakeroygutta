create or replace view "public"."awayteam_view" as  SELECT mat.id AS match_id,
    jsonb_build_object('id', at.id, 'name', at.name, 'color', at.color, 'players', jsonb_agg(jsonb_build_object('id', ap.id, 'name', ap.name, 'goals', ( SELECT COALESCE(array_length(array_agg(goa.player_id), 1), 0) AS "coalesce"
           FROM goals goa
          WHERE ((goa.match_id = mat.id) AND (goa.player_id = ap.id))), 'assists', ( SELECT COALESCE(array_length(array_agg(ass.player_id), 1), 0) AS "coalesce"
           FROM assists ass
          WHERE ((ass.match_id = mat.id) AND (ass.player_id = ap.id))), 'clutches', ( SELECT COALESCE(array_length(array_agg(clu.player_id), 1), 0) AS "coalesce"
           FROM clutches clu
          WHERE ((clu.match_id = mat.id) AND (clu.player_id = ap.id)))))) AS away_team
   FROM (((matches mat
     LEFT JOIN teams at ON ((at.id = mat.team_away_id)))
     LEFT JOIN teams_players atp ON ((atp.team_id = at.id)))
     LEFT JOIN players ap ON ((ap.id = atp.player_id)))
  GROUP BY mat.id, at.id;


create or replace view "public"."hometeam_view" as  SELECT mat.id AS match_id,
    jsonb_build_object('id', ht.id, 'name', ht.name, 'color', ht.color, 'players', jsonb_agg(jsonb_build_object('id', hp.id, 'name', hp.name, 'goals', ( SELECT COALESCE(array_length(array_agg(goa.player_id), 1), 0) AS "coalesce"
           FROM goals goa
          WHERE ((goa.match_id = mat.id) AND (goa.player_id = hp.id))), 'assists', ( SELECT COALESCE(array_length(array_agg(ass.player_id), 1), 0) AS "coalesce"
           FROM assists ass
          WHERE ((ass.match_id = mat.id) AND (ass.player_id = hp.id))), 'clutches', ( SELECT COALESCE(array_length(array_agg(clu.player_id), 1), 0) AS "coalesce"
           FROM clutches clu
          WHERE ((clu.match_id = mat.id) AND (clu.player_id = hp.id)))))) AS home_team
   FROM (((matches mat
     LEFT JOIN teams ht ON ((ht.id = mat.team_home_id)))
     LEFT JOIN teams_players htp ON ((htp.team_id = ht.id)))
     LEFT JOIN players hp ON ((hp.id = htp.player_id)))
  GROUP BY mat.id, ht.id;


create or replace view "public"."matchstats_view" as  SELECT mat.id AS match_id,
    mat.season_id,
    ht.home_team,
    at.away_team
   FROM ((matches mat
     LEFT JOIN hometeam_view ht ON ((ht.match_id = mat.id)))
     LEFT JOIN awayteam_view at ON ((at.match_id = mat.id)));



