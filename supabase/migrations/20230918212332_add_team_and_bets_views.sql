create or replace view "public"."bets_with_challengers" as  SELECT bet.id,
    bet.bet,
    bet.value,
    bet.season_id,
    jsonb_build_object('id', use.id, 'name', use.nickname) AS better,
    jsonb_agg(jsonb_build_object('id', cha.id, 'name', cha.nickname)) AS challengers
   FROM (((bets bet
     JOIN users use ON ((bet.user_id = use.id)))
     LEFT JOIN bets_against bag ON ((bet.id = bag.bet_id)))
     LEFT JOIN users cha ON ((bag.user_id = cha.id)))
  GROUP BY bet.id, use.id;


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



