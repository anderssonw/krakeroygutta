INSERT INTO seasons (name, start_time, deadline_time, end_time, starting_currency)
VALUES ('Winter 2022', '2022-12-1 12:00:00', '2022-12-15 12:00:00', '2022-12-24 12:00:00', 25000),
       ('Summer 2023', '2023-06-1 12:00:00', '2023-06-15 12:00:00', '2023-09-1 12:00:00', 25000),
       ('Winter 2023', '2023-12-1 12:00:00', '2023-12-15 12:00:00', '2023-12-24 12:00:00', 25000);

INSERT INTO teams (season_id, name, color, player_ids)
VALUES (2, 'Røde Runkere', 'red', ARRAY[1, 2, 3]),
       (2, 'Blå Bavianer', 'blue', ARRAY[4, 5, 6]),
       (2, 'Hvite Hvalrosser', 'white', ARRAY[7, 8, 9]),
       (2, 'Grønne Galinger', 'green', ARRAY[10, 11, 12]);

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
       ('Peder Eide', 'placeholder.png'),
       ('Magnus Gulbrandsen', 'placeholder.png');

INSERT INTO players_seasons (player_id, season_id)
VALUES (1, 2),
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
       (12, 2),
       (13, 2);

INSERT INTO auth.users (id)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf');

INSERT INTO fantasy_team (user_id, season_id, name, captain_id)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Banter FC' , 4);

INSERT INTO fantasy_teams_players (fantasy_team_id, player_id)
VALUES (1, 1),
       (1, 4),
       (1, 7),
       (1, 10);

INSERT INTO matches (season_id, team_home_id, team_away_id, goals_player_ids, assists_player_ids, clutches_player_ids)
VALUES (2, 1, 2, ARRAY[1, 2, 4], ARRAY[2, 1, 5], ARRAY[6]),
       (2, 2, 1, DEFAULT, DEFAULT, ARRAY[3, 5]),
       (2, 3, 4, ARRAY[7], ARRAY[8], ARRAY[10, 11]);
    