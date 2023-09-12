create or replace view "public"."match_statistics" as  SELECT mat.id AS match_id,
    mat.season_id,
        CASE
            WHEN (count(DISTINCT goa.player_id) > 0) THEN array_agg(DISTINCT goa.player_id)
            ELSE ARRAY[]::bigint[]
        END AS goals,
        CASE
            WHEN (count(DISTINCT ass.player_id) > 0) THEN array_agg(DISTINCT ass.player_id)
            ELSE ARRAY[]::bigint[]
        END AS assists,
        CASE
            WHEN (count(DISTINCT clu.player_id) > 0) THEN array_agg(DISTINCT clu.player_id)
            ELSE ARRAY[]::bigint[]
        END AS clutches,
    jsonb_build_object('team_id', ht.id, 'team_name', ht.name, 'team_color', ht.color, 'team_players', jsonb_agg(DISTINCT jsonb_build_object('player_id', hp.id, 'name', hp.name))) AS home_team,
    jsonb_build_object('team_id', at.id, 'team_name', at.name, 'team_color', at.color, 'team_players', jsonb_agg(DISTINCT jsonb_build_object('player_id', ap.id, 'name', ap.name))) AS away_team
   FROM (((((((((matches mat
     LEFT JOIN goals goa ON ((goa.match_id = mat.id)))
     LEFT JOIN assists ass ON ((ass.match_id = mat.id)))
     LEFT JOIN clutches clu ON ((clu.match_id = mat.id)))
     LEFT JOIN teams ht ON ((ht.id = mat.team_home_id)))
     LEFT JOIN teams_players htp ON ((htp.team_id = ht.id)))
     LEFT JOIN players hp ON ((hp.id = htp.player_id)))
     LEFT JOIN teams at ON ((at.id = mat.team_away_id)))
     LEFT JOIN teams_players atp ON ((atp.team_id = at.id)))
     LEFT JOIN players ap ON ((ap.id = atp.player_id)))
  GROUP BY mat.id, mat.season_id, ht.id, at.id;



