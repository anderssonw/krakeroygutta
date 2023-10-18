INSERT INTO seasons (name, start_time, deadline_time, end_time, starting_currency)
VALUES ('Winter 2022', '2022-12-1 12:00:00', '2022-12-15 12:00:00', '2022-12-24 12:00:00', 25000),
       ('Summer 2023', '2023-06-1 12:00:00', '2023-06-15 12:00:00', '2023-11-1 12:00:00', 25000);

INSERT INTO teams (season_id, name, color)
VALUES (2, 'Røde Runkere', 'red'),
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
       ('Peder Eide', 'placeholder.png'),
       ('Magnus Gulbrandsen', 'placeholder.png');

INSERT INTO players_seasons (player_id, season_id, attack, defence, skill, morale, physical)
VALUES (1, 2, 53, 61, 65, 70, 65),
       (2, 2, 66, 47, 55, 76, 66),
       (3, 2, 48, 62, 50, 94, 46),
       (4, 2, 92, 84, 81, 68, 76),
       (5, 2, 64, 83, 77, 74, 57),
       (6, 2, 81, 69, 92, 69, 49),
       (7, 2, 74, 88, 68, 70, 70),
       (8, 2, 68, 61, 64, 80, 82),
       (9, 2, 57, 71, 72, 71, 74),
       (10, 2, 75, 53, 68, 46, 93),
       (11, 2, 49, 65, 52, 86, 67),
       (12, 2, 64, 70, 61, 54, 91),
       (13, 2, 84, 76, 95, 72, 78);

INSERT INTO auth.users (id, raw_user_meta_data)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', '{"nickname": "bing chilling"}'),
       ('ec61970a-704a-4c92-8d54-1a3181175c91', '{"nickname": "chill bill"}'),
       ('c43e4127-0ba4-4db4-b217-61898937542d', '{"nickname": "xue hue"}');


INSERT INTO fantasy_teams (user_id, season_id, name, captain_id)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Skulle Chippa FC' , 1),
       ('ec61970a-704a-4c92-8d54-1a3181175c91', 2, 'Jørgens Tubaer' , 5),
       ('c43e4127-0ba4-4db4-b217-61898937542d', 2, 'PAD MAMAAAAAA' , 9);

INSERT INTO fantasy_teams_players(fantasy_team_id, player_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (2, 5),
       (2, 6),
       (2, 7),
       (2, 8),
       (3, 9),
       (3, 10),
       (3, 11),
       (3, 12);

INSERT INTO teams_players(team_id, player_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (2, 5),
       (2, 6),
       (2, 7),
       (2, 8),
       (3, 9),
       (3, 10),
       (3, 11),
       (3, 12),
       (3, 13);

INSERT INTO matches (season_id, team_home_id, team_away_id)
VALUES  (2, 1, 2),
        (2, 2, 3),
        (2, 1, 3);

INSERT INTO goals(match_id, goal_player_id, assist_player_id)
VALUES (1, 1, 2),
       (1, 3, 4),
       (2, 5, 6);

INSERT INTO clutches(match_id, player_id)
VALUES (1, 1),
       (1, 5),
       (2, 5),
       (2, 9),
       (3, 1),
       (3, 12);

INSERT INTO bets(user_id, season_id, bet, value)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Herman scorer ingen mål', 100);


INSERT INTO bets_against(bet_id, user_id)
VALUES (1, 'ec61970a-704a-4c92-8d54-1a3181175c91');