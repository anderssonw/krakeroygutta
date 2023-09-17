create or replace view "public"."teamswithplayers_view" as  SELECT tea.season_id,
    tea.color,
    tea.name,
    jsonb_agg(jsonb_build_object('id', pla.id, 'name', pla.name, 'image', pla.image, 'attack', pls.attack, 'defence', pls.defence, 'physical', pls.physical, 'morale', pls.morale, 'price', pls.price)) AS players
   FROM (((teams tea
     JOIN teams_players tp ON ((tea.id = tp.team_id)))
     JOIN players pla ON ((tp.player_id = pla.id)))
     JOIN players_seasons pls ON ((pla.id = pls.player_id)))
  WHERE (tea.season_id = pls.season_id)
  GROUP BY tea.season_id, tea.color, tea.name;



