create or replace view "public"."team_with_stats" as  SELECT mat.id AS match_id,
    mat.season_id,
    tea.id AS team_id,
    tea.name,
    tea.color,
    jsonb_agg(jsonb_build_object('id', pla.id, 'name', pla.name, 'goals', ( SELECT count(goa.player_id) AS count
           FROM goals goa
          WHERE ((goa.match_id = mat.id) AND (goa.player_id = pla.id))), 'assists', ( SELECT count(ass.player_id) AS count
           FROM assists ass
          WHERE ((ass.match_id = mat.id) AND (ass.player_id = pla.id))), 'clutches', ( SELECT count(clu.player_id) AS count
           FROM clutches clu
          WHERE ((clu.match_id = mat.id) AND (clu.player_id = pla.id))))) AS players
   FROM (((matches mat
     LEFT JOIN teams tea ON (((mat.team_home_id = tea.id) OR (mat.team_away_id = tea.id))))
     JOIN teams_players tep ON ((tea.id = tep.team_id)))
     JOIN players pla ON ((tep.player_id = pla.id)))
  GROUP BY mat.id, tea.id;



