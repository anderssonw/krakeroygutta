INSERT INTO seasons (name, start_time, deadline_time, end_time, starting_currency)
VALUES ('Cageball Høst 2023', '2023-11-16 12:00:00', '2023-11-18 14:30:00', '2023-11-19 18:00:00', 20000),
       ('Julebord Futsalturnering 2023', '2024-12-1 18:00:00', '2024-12-21 12:00:00', '2024-12-24 18:00:00', 20000);

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

INSERT INTO players_seasons (player_id, season_id, attack, defence, skill, morale, physical, price)
VALUES  (1, 1, 53, 61, 65, 70, 65, 4200),
        (3, 1, 48, 62, 50, 94, 46, 3300),
        (4, 1, 92, 84, 81, 68, 76, 6700),
        (5, 1, 64, 83, 77, 74, 57, 4900),
        (8, 1, 68, 61, 64, 80, 82, 5100),
        (9, 1, 57, 71, 72, 71, 74, 4600),
        (10, 1, 75, 53, 68, 46, 93, 4500),
        (13, 1, 84, 76, 95, 72, 78, 6500),
        (14, 1, 42, 51, 44, 82, 92, 3300);

INSERT INTO players_seasons (player_id, season_id, attack, defence, skill, morale, physical, inform_image)
VALUES  (1, 2, 53, 61, 65, 70, 65, null),
        (2, 2, 66, 47, 55, 76, 66, null),
        (3, 2, 48, 62, 50, 94, 46, null),
        (4, 2, 92, 84, 81, 68, 76, null),
        (5, 2, 64, 83, 77, 74, 57, null),
        (6, 2, 81, 69, 92, 69, 49, null),
        (7, 2, 74, 88, 68, 70, 70, null),
        (8, 2, 68, 61, 64, 80, 82, null),
        (9, 2, 57, 71, 72, 71, 74, null),
        (10, 2, 75, 53, 68, 46, 93, null),
        (11, 2, 49, 65, 52, 86, 67, 'https://i.imgur.com/O4b0bvY.png'),
        (12, 2, 64, 70, 61, 54, 91, null),
        (13, 2, 84, 76, 95, 72, 78, null);

INSERT INTO teams (season_id, name, color)
VALUES (1, 'Røde Runkere', 'red'),
       (1, 'Blå Bavianer', 'blue'),
       (1, 'Grønne Galinger', 'green'),
       (1, 'Hvite Hvalrosser', 'white'),
       (2, 'Røde Runkere New', 'red'),
       (2, 'Blå Bavianer New', 'blue'),
       (2, 'Hvite Hvalrosser New', 'white'),
       (2, 'Grønne Galinger New', 'green');

INSERT INTO teams_players(team_id, player_id)
VALUES (5, 1),
       (5, 2),
       (5, 3),
       (5, 4),
       (6, 5),
       (6, 6),
       (6, 7),
       (6, 8),
       (7, 9),
       (7, 10),
       (7, 11),
       (7, 12),
       (8, 13);