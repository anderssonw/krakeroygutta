INSERT INTO seasons (name, start_date, end_date)
VALUES ('Winter 2022', '2022-12-1 12:00:00', '2022-12-24 12:00:00'),
       ('Summer 2023', '2023-06-1 12:00:00', '2023-09-1 12:00:00'),
       ('Winter 2023', '2023-12-1 12:00:00', '2023-12-24 12:00:00');

INSERT INTO teams (sid, name)
VALUES (2, 'Lag rod', 'red'),
       (2, 'Lag blaa', 'blue'),
       (2, 'Lag hvit', 'white'),
       (2, 'Lag gronn', 'green');

INSERT INTO players (name, price, image)
VALUES ('Wiliam Anderson', 3000, 'placeholder.png'),
       ('Ask Kase', 3000, 'placeholder.png'),
       ('Elias Gauslaa', 3500, 'placeholder.png'),
       ('Njard Kobberdal', 3500, 'placeholder.png'),
       ('Herman Furuseth', 4000, 'placeholder.png'),
       ('Jorgen Alfredsen', 4000, 'placeholder.png'),
       ('Johan Bjerkholt', 4500, 'placeholder.png'),
       ('Hans Langvik', 4500, 'placeholder.png'),
       ('Mads Gjellebaek', 5000, 'placeholder.png'),
       ('Alexander Hestengen', 5000, 'placeholder.png'),
       ('Eirik Stormoen', 5500, 'placeholder.png'),
       ('Peder Eide', 5500, 'placeholder.png'),
       ('Magnus Gulbrandsen', 6000, 'placeholder.png');

INSERT INTO fantasy (uid, sid)
VALUES ('f0373b98-861f-45de-ba40-dc4cf9161a77', 2, "Banter FC");