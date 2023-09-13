CREATE INDEX at_index ON public.matches USING btree (team_away_id);

CREATE INDEX ht_index ON public.matches USING btree (team_home_id);

CREATE INDEX match_index ON public.matches USING btree (id);

CREATE INDEX player_index ON public.players USING btree (id);

CREATE INDEX team_index ON public.teams USING btree (id);

CREATE INDEX tp_index ON public.teams_players USING btree (team_id, player_id);

create or replace view "public"."matchstats_view" as  WITH home_team_cte AS (
         SELECT mat_1.id AS match_id,
            ht_1.id,
            ht_1.name,
            ht_1.color,
            jsonb_agg(jsonb_build_object('id', hp.id, 'name', hp.name, 'goals', ( SELECT count(goa.player_id) AS count
                   FROM goals goa
                  WHERE ((goa.match_id = mat_1.id) AND (goa.player_id = hp.id))), 'assists', ( SELECT count(ass.player_id) AS count
                   FROM assists ass
                  WHERE ((ass.match_id = mat_1.id) AND (ass.player_id = hp.id))), 'clutches', ( SELECT count(clu.player_id) AS count
                   FROM clutches clu
                  WHERE ((clu.match_id = mat_1.id) AND (clu.player_id = hp.id))))) AS players
           FROM (((matches mat_1
             LEFT JOIN teams ht_1 ON ((mat_1.team_home_id = ht_1.id)))
             LEFT JOIN teams_players htp ON ((ht_1.id = htp.team_id)))
             LEFT JOIN players hp ON ((htp.player_id = hp.id)))
          GROUP BY mat_1.id, ht_1.id
        ), away_team_cte AS (
         SELECT mat_1.id AS match_id,
            at_1.id,
            at_1.name,
            at_1.color,
            jsonb_agg(jsonb_build_object('id', ap.id, 'name', ap.name, 'goals', ( SELECT count(goa.player_id) AS count
                   FROM goals goa
                  WHERE ((goa.match_id = mat_1.id) AND (goa.player_id = ap.id))), 'assists', ( SELECT count(ass.player_id) AS count
                   FROM assists ass
                  WHERE ((ass.match_id = mat_1.id) AND (ass.player_id = ap.id))), 'clutches', ( SELECT count(clu.player_id) AS count
                   FROM clutches clu
                  WHERE ((clu.match_id = mat_1.id) AND (clu.player_id = ap.id))))) AS players
           FROM (((matches mat_1
             LEFT JOIN teams at_1 ON ((mat_1.team_away_id = at_1.id)))
             LEFT JOIN teams_players atp ON ((at_1.id = atp.team_id)))
             LEFT JOIN players ap ON ((atp.player_id = ap.id)))
          GROUP BY mat_1.id, at_1.id
        )
 SELECT mat.id AS match_id,
    jsonb_build_object('id', ht.id, 'name', ht.name, 'color', ht.color, 'players', ht.players) AS home_team,
    jsonb_build_object('id', at.id, 'name', at.name, 'color', at.color, 'players', at.players) AS away_team
   FROM ((matches mat
     LEFT JOIN home_team_cte ht ON ((mat.id = ht.match_id)))
     LEFT JOIN away_team_cte at ON ((mat.id = at.match_id)));



