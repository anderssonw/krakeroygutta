INSERT INTO seasons (name, start_time, deadline_time, end_time, starting_currency)
VALUES ('Winter 2021', '2021-12-1 12:00:00', '2021-12-12 12:00:00', '2021-12-24 12:00:00', 25000),
       ('Winter 2022', '2022-12-1 12:00:00', '2022-12-12 12:00:00', '2022-12-24 12:00:00', 25000),
       ('Winter 2023', '2023-12-1 12:00:00', '2023-12-12 12:00:00', '2023-12-24 12:00:00', 25000);

INSERT INTO players (name, image)
VALUES ('Wiliam Andersson', 'https://i.imgur.com/1ttlwn2.png'),
       ('Ask Kase', 'https://i.imgur.com/DMH66kY.png'),
       ('Elias Gauslaa', 'https://i.imgur.com/DMH66kY.png'),
       ('Njard Kobberdal', 'https://i.imgur.com/DMH66kY.png'),
       ('Herman Furuseth', 'https://i.imgur.com/6zBse6D.png'),
       ('Jorgen Alfredsen', 'https://i.imgur.com/DMH66kY.png'),
       ('Johan Bjerkholt', 'https://i.imgur.com/DMH66kY.png'),
       ('Hans Langvik', 'https://i.imgur.com/JR2nkG3.png'),
       ('Mads Gjellebaek', 'https://i.imgur.com/DMH66kY.png'),
       ('Alexander Hestengen', 'https://i.imgur.com/DMH66kY.png'),
       ('Eirik Stormoen', 'https://i.imgur.com/DMH66kY.png'),
       ('Peder Eide', 'https://i.imgur.com/DMH66kY.png'),
       ('Magnus Gulbrandsen', 'https://i.imgur.com/pdHYScX.png'),
       ('Andreas Lindroth', 'https://i.imgur.com/DMH66kY.png'),
       ('Endor Nordengen', 'https://i.imgur.com/DMH66kY.png'),
       ('Eilif Fagerli-Wilhelmsen', 'https://i.imgur.com/DMH66kY.png');

INSERT INTO players_seasons (player_id, season_id, attack, defence, skill, morale, physical, price, inform_image)
VALUES (13, 1, 60, 60, 60, 60, 60, 3300, null),
       (13, 2, 64, 64, 64, 64, 64, 4000, 'https://i.imgur.com/DMH66kY.png'),
       (13, 3, 71, 71, 71, 71, 71, 4200, null);

INSERT INTO teams (season_id, name, color)
VALUES (1, 'Røde Runkere', 'red'),
       (1, 'Blå Bavianer', 'blue'),
       (2, 'Røde Runkere', 'red'),
       (2, 'Blå Bavianer', 'blue'),
       (3, 'Røde Runkere', 'red'),
       (3, 'Blå Bavianer', 'blue');

INSERT INTO teams_players(team_id, player_id)
VALUES (1, 13),
       (3, 13),
       (5, 13);

INSERT INTO matches (season_id, team_home_id, team_away_id)
VALUES  (1, 1, 2),
        (2, 3, 4),
        (3, 5, 6);

INSERT INTO goals(match_id, goal_player_id, assist_player_id)
VALUES (1, 13, null),
       (1, 13, null),
       (1, 13, null),
       (1, 13, null),
       (1, 13, null),
       (1, 13, null),
       (2, 13, null),
       (2, 13, null),
       (2, 13, null),
       (2, 13, null),
       (3, 13, null);

INSERT INTO clutches(match_id, player_id)
VALUES (1, 13),
        (1, 13),
        (1, 13),
        (1, 13),
        (2, 13),
        (2, 13);

/*
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

INSERT INTO bets(user_id, season_id, bet, value)
VALUES ('25f77d08-43a9-44b1-99fb-67597562bcaf', 2, 'Herman scorer ingen mål', 100);


INSERT INTO bets_against(bet_id, user_id)
VALUES (1, 'ec61970a-704a-4c92-8d54-1a3181175c91');

*/