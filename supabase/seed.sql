INSERT INTO seasons (name, start_time, deadline_time, end_time, starting_currency)
VALUES ('Winter 2022', '2022-12-1 12:00:00', '2022-12-15 12:00:00', '2022-12-24 12:00:00', 25000),
       ('Summer 2023', '2023-06-1 12:00:00', '2023-06-15 12:00:00', '2023-11-1 12:00:00', 25000);

INSERT INTO teams (season_id, name, color)
VALUES (1, 'Røde Runkere Old Boys', 'red'),
       (1, 'Blå Bavianer Old Boys', 'blue'),
       (2, 'Røde Runkere', 'red'),
       (2, 'Blå Bavianer', 'blue'),
       (2, 'Grønne Galinger', 'green'),
       (2, 'Hvite Hvalrosser', 'white'),
       (3, 'Røde Runkere New', 'red'),
       (3, 'Blå Bavianer New', 'blue'),
       (3, 'Hvite Hvalrosser New', 'white'),
       (3, 'Grønne Galinger New', 'green');

INSERT INTO players (name, image)
VALUES ('Wiliam Andersson', 'placeholder.png'),
       ('Ask Kase', 'placeholder.png'),
       ('Elias Gauslaa', 'placeholder.png'),
       ('Njard Kobberdal', 'placeholder.png'),
       ('Herman Furuseth', 'placeholder.png'),
       ('Jorgen Alfredsen', 'placeholder.png'),
       ('Johan Bjerkholt', 'placeholder.png'),
       ('Hans Langvik', 'placeholder.png'),
       ('Mads Gjellebaek', 'placeholder.png'),
       ('Alexander Hestengen', 'placeholder.png'),
       ('Eirik Stormoen', 'placeholder.png'),
       ('Peder Eide', 'placeholder.png');

INSERT INTO players_seasons (player_id, season_id)
VALUES (1, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (5, 1),
       (6, 1),
       (7, 1),
       (8, 1),
       (1, 2),
       (2, 2),
       (3, 2),
       (4, 2),
       (5, 2),
       (6, 2),
       (7, 2),
       (8, 2),
       (9, 2),
       (10, 2),
       (11, 2),
       (12, 2);

INSERT INTO auth.users (id, raw_user_meta_data)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', '{"nickname": "bing chilling"}'),
       ('ec61970a-704a-4c92-8d54-1a3181175c91', '{"nickname": "chill bill"}'),
       ('c43e4127-0ba4-4db4-b217-61898937542d', '{"nickname": "xue hue"}');


INSERT INTO fantasy_teams (user_id, season_id, name, captain_id)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Skulle Chippa FC' , 1),
       ('ec61970a-704a-4c92-8d54-1a3181175c91', 2, 'Jørgens Tubaer' , 2),
       ('c43e4127-0ba4-4db4-b217-61898937542d', 2, 'PAD MAMAAAAAA' , 3);

INSERT INTO fantasy_teams_players(fantasy_team_id, player_id)
VALUES (1, 1),
       (1, 2),
       (1, 7),
       (1, 8),
       (2, 1),
       (2, 2),
       (2, 3),
       (2, 4),
       (3, 3),
       (3, 10);

INSERT INTO teams_players(team_id, player_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (2, 5),
       (2, 6),
       (2, 7),
       (2, 8),
       (3, 1),
       (3, 2),
       (3, 3),
       (3, 4),
       (4, 5),
       (4, 6),
       (4, 7),
       (4, 8),
       (5, 9),
       (5, 10),
       (5, 11),
       (5, 12);

INSERT INTO matches (season_id, team_home_id, team_away_id)
VALUES (1, 1, 2),
       (1, 2, 1),
       (1, 1, 2),
       (1, 2, 1),
       (2, 3, 4),
       (2, 3, 5);

INSERT INTO goals(match_id, player_id)
VALUES (1, 1),
       (1, 1),
       (3, 1),
       (3, 1),
       (3, 1),
       (5, 1);

INSERT INTO assists(match_id, player_id)
VALUES (1, 1),
       (2, 1),
       (2, 1),
       (3, 1),
       (4, 1),
       (4, 1),
       (6, 1),
       (6, 1);

INSERT INTO clutches(match_id, player_id)
VALUES (1, 1),
       (1, 1),
       (1, 1),
       (1, 1),
       (2, 1),
       (2, 1),
       (2, 1),
       (2, 1),
       (3, 1),
       (3, 1),
       (3, 1),
       (3, 1),
       (3, 1),
       (4, 1),
       (4, 1),
       (4, 1),
       (5, 1),
       (5, 1);

INSERT INTO bets(user_id, season_id, bet, value)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Herman scorer ingen mål', 100);


INSERT INTO bets_against(bet_id, user_id)
VALUES (1, 'ec61970a-704a-4c92-8d54-1a3181175c91');