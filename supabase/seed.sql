SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."players" ("id", "name", "image") VALUES
	(1, 'Wiliam Andersson', 'https://i.imgur.com/1ttlwn2.png'),
	(8, 'Hans Langvik', 'https://i.imgur.com/JR2nkG3.png'),
	(13, 'Magnus Gulbrandsen', 'https://i.imgur.com/pdHYScX.png'),
	(9, 'Mads Gjellebaek', 'https://i.imgur.com/RsFE3rR.png'),
	(5, 'Herman Furuseth', 'https://i.imgur.com/v9ipeQr.png'),
	(3, 'Elias Gauslaa', 'https://i.imgur.com/3pRvwFG.png'),
	(6, 'Jorgen Alfredsen', 'https://i.imgur.com/lKFTkoq.png'),
	(10, 'Alexander Hestengen', 'https://i.imgur.com/hQV7vm0.png'),
	(4, 'Njard Kobberdal', 'https://i.imgur.com/ugOfHuS.png'),
	(11, 'Eirik Stormoen', 'https://i.imgur.com/Z8rRjPw.png'),
	(14, 'Andreas Lindroth', 'https://i.imgur.com/01YZFV8.png'),
	(15, 'Endor Nordengen', 'https://i.imgur.com/K6rnDOl.png'),
	(2, 'Ask Kase', 'https://i.imgur.com/mP3dPW0.png'),
	(7, 'Johan Bjerkholt', 'https://i.imgur.com/O1OOPGh.png'),
	(16, 'Eilif Fagerli-Wilhelmsen', 'https://i.imgur.com/4c7WZ4W.png'),
	(12, 'Peder Eide', 'https://i.imgur.com/SpoAJ3T.png');


--
-- Data for Name: seasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seasons" ("id", "start_time", "deadline_time", "end_time", "name", "starting_currency", "points_per_assist", "points_per_clean_sheet", "points_per_clutch", "points_per_goal", "points_per_win") VALUES
	(1, '2023-11-16 12:00:00', '2023-11-18 14:30:00', '2023-11-18 18:00:00', 'Cageball Høst 2023', 20000, 1, 1, 1, 1, 1),
	(2, '2023-12-01 08:00:00', '2023-12-16 11:00:00', '2023-12-16 18:00:00', 'Julebord Futsalturnering 2023', 20000, 2, 1, 1, 3, 3),
	(3, '2024-12-18 08:00:00', '2024-12-21 11:00:00', '2024-12-21 18:00:00', 'Julebord Futsalturnering 2024', 20000, 3, 1, 3, 6, 2),
	(5, '2025-12-14 12:00:00', '2025-12-20 10:00:00', '2025-12-20 17:00:00', 'Julebord Futsalturnering 2025', 20000, 3, 1, 3, 6, 2);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

-- INSERT INTO "public"."users" ("id", "is_admin", "is_superadmin", "nickname", "player_id") VALUES
-- 	('1eaed85d-45cc-4714-b99c-4493de40196e', false, false, 'Cheese balls', NULL),
-- 	('c13616ff-ebac-408c-9cdd-ef36b5a933a2', true, true, 'gabbern', 1),
-- 	('7e2d3c59-d70b-4583-a866-de0c2db784f5', true, true, 'Mæggi G', 13),
-- 	('882a8d04-e064-4212-9742-e34dd6bc4df0', false, false, 'Hansista El Magista', 8),
-- 	('625a49da-008c-4d03-8d7f-143b97c7fdcf', true, true, 'Mads', 9),
-- 	('7334d785-564f-4024-86b9-61e13b901f08', false, false, 'njakob', 4),
-- 	('e3ca0083-fd2d-4e49-9574-d3019ed9e9b7', false, false, 'Bezoomny Jeezny ', NULL),
-- 	('9f5c628f-7330-4ae2-ae2a-44e95b047cd5', false, false, 'Skjakkf', 5),
-- 	('482392ac-977a-41a6-8de7-438d2eb52d28', false, false, 'Bezoomny Jeezny ', 2),
-- 	('480cff16-f1be-49d8-8f71-b7cca47b5003', false, false, 'kjekkasboy', 10),
-- 	('ee297415-dee7-40da-afa4-6a44818d6ce1', false, false, 'Treskeren', 11),
-- 	('b2510879-8185-4325-9ab9-7ebaf8266d90', false, false, 'Njård', 4),
-- 	('b7fe24dd-02c1-453b-82a3-fadb9e39a149', false, false, 'Liffen', 16),
-- 	('6cafbfe0-327e-4128-810b-e5a719c80a43', false, false, 'Onkel', 7),
-- 	('8af15bb1-78eb-437c-b3b1-8b8337695449', false, false, 'Alexander Hestengen', 10),
-- 	('a45cffa0-8632-4fdd-961f-ffe982c70797', true, true, 'Vondt i rygygen', 12),
-- 	('261b8260-5b0b-4d8a-9fa3-fbf52dc7f629', false, false, 'Hookebuksene', 3),
-- 	('3273c98f-bdc4-4897-a2e1-f288de739621', false, false, 'Kamferdrops', 6),
-- 	('b42fdfdb-91f2-4f08-ad06-5f087a649d49', true, true, 'Anders Endor Nordengen', 15),
-- 	('9602c5eb-e483-48cd-89ed-f42e19ffbe9f', false, false, 'Andreas', NULL);


--
-- Data for Name: bets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bets" ("id", "user_id", "season_id", "bet", "value") VALUES
	(1, '7e2d3c59-d70b-4583-a866-de0c2db784f5', 1, 'Guttarna G vinner turneringa', 100),
	(2, '480cff16-f1be-49d8-8f71-b7cca47b5003', 1, 'Kællærnæ Kul over -10 i målforskjell', 69),
	(3, '625a49da-008c-4d03-8d7f-143b97c7fdcf', 1, 'Hans under 2,5 mål.', 100),
	(5, '7334d785-564f-4024-86b9-61e13b901f08', 1, 'Njård scorer fler mål enn Lindroth', 5780),
	(6, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5', 1, 'Herman scorer 4 eller flere mål i løpet av turneringa', 100),
	(7, '6cafbfe0-327e-4128-810b-e5a719c80a43', 2, 'Jeg vedder på at Herman kommer for sent til fotballen og julebordet. En pils per forsentcumming ', 2),
	(9, '7e2d3c59-d70b-4583-a866-de0c2db784f5', 2, 'Lindroth scorer flere mål enn Elias', 69),
	(11, '480cff16-f1be-49d8-8f71-b7cca47b5003', 2, 'Alexander scorer flere mål enn Njård', 69),
	(12, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2', 2, 'William scorer flere mål enn Eirik + Elias', 69),
	(13, '8af15bb1-78eb-437c-b3b1-8b8337695449', 3, 'Ask scorer selvmål', 69),
	(14, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5', 3, 'Roys Råtne tar pokalen', 100),
	(16, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2', 3, 'William blir ikke blant de 5 dårligste poengiverene', 50),
	(18, '625a49da-008c-4d03-8d7f-143b97c7fdcf', 3, 'Alex vinner quizzen i år', 50);


--
-- Data for Name: bets_against; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bets_against" ("id", "bet_id", "user_id") VALUES
	(1, 1, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5'),
	(2, 1, '625a49da-008c-4d03-8d7f-143b97c7fdcf'),
	(3, 3, '882a8d04-e064-4212-9742-e34dd6bc4df0'),
	(4, 6, '7e2d3c59-d70b-4583-a866-de0c2db784f5'),
	(5, 7, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5'),
	(6, 7, '7e2d3c59-d70b-4583-a866-de0c2db784f5'),
	(8, 7, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2'),
	(9, 11, '7e2d3c59-d70b-4583-a866-de0c2db784f5'),
	(10, 7, '1eaed85d-45cc-4714-b99c-4493de40196e'),
	(11, 9, '261b8260-5b0b-4d8a-9fa3-fbf52dc7f629'),
	(12, 11, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2'),
	(13, 12, '480cff16-f1be-49d8-8f71-b7cca47b5003'),
	(14, 14, '8af15bb1-78eb-437c-b3b1-8b8337695449'),
	(15, 13, '7e2d3c59-d70b-4583-a866-de0c2db784f5'),
	(19, 14, '625a49da-008c-4d03-8d7f-143b97c7fdcf'),
	(20, 16, '625a49da-008c-4d03-8d7f-143b97c7fdcf'),
	(21, 16, 'ee297415-dee7-40da-afa4-6a44818d6ce1'),
	(22, 13, 'ee297415-dee7-40da-afa4-6a44818d6ce1'),
	(23, 16, 'b7fe24dd-02c1-453b-82a3-fadb9e39a149');


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."teams" ("id", "season_id", "name", "color") VALUES
	(1, 1, 'Boisarna Brun', 'black'),
	(3, 1, 'Kællærnæ Kul', 'red'),
	(2, 1, 'Guttarna G', 'white'),
	(5, 2, 'Guttarna G', 'red'),
	(4, 2, 'Boisarna Brun', 'black'),
	(6, 2, 'Kællærnæ Kul', 'white'),
	(8, 3, 'Guttarna G', 'green'),
	(7, 3, 'Boisarna Brun', 'black'),
	(9, 3, 'Roys Råtne', 'red'),
	(12, 5, 'Roys Røde Råtne', 'red'),
	(14, 5, 'Boysarna Brun', 'black'),
	(13, 5, 'Goblins Grønne', 'green');


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."matches" ("id", "season_id", "team_home_id", "team_away_id") VALUES
	(1, 1, 2, 1),
	(2, 1, 3, 2),
	(3, 1, 1, 3),
	(4, 1, 1, 2),
	(5, 1, 3, 2),
	(6, 1, 1, 3),
	(7, 1, 1, 2),
	(8, 1, 3, 2),
	(9, 1, 2, 1),
	(10, 1, 1, 3),
	(11, 1, 3, 2),
	(12, 1, 1, 2),
	(13, 1, 1, 3),
	(14, 1, 1, 3),
	(16, 2, 4, 6),
	(17, 2, 6, 5),
	(18, 2, 4, 5),
	(19, 2, 6, 4),
	(20, 2, 6, 5),
	(21, 2, 4, 5),
	(22, 2, 4, 6),
	(23, 2, 6, 5),
	(24, 2, 4, 5),
	(25, 2, 4, 6),
	(26, 2, 6, 5),
	(27, 2, 4, 5),
	(28, 2, 6, 4),
	(29, 2, 5, 6),
	(30, 2, 4, 5),
	(32, 2, 5, 4),
	(37, 3, 8, 9),
	(38, 3, 8, 7),
	(39, 3, 9, 7),
	(40, 3, 8, 9),
	(41, 3, 8, 7),
	(43, 3, 7, 9),
	(44, 3, 8, 9),
	(45, 3, 8, 7),
	(46, 3, 9, 7),
	(47, 3, 9, 8),
	(48, 3, 9, 7),
	(49, 3, 8, 7),
	(50, 3, 8, 9),
	(51, 3, 7, 9),
	(52, 3, 7, 8),
	(53, 3, 9, 8),
	(54, 3, 7, 9),
	(55, 3, 7, 8),
	(56, 3, 9, 8),
	(57, 3, 9, 7),
	(58, 3, 8, 7);


--
-- Data for Name: clutches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."clutches" ("id", "player_id", "match_id") VALUES
	(1, 5, 6),
	(2, 14, 8),
	(3, 5, 10),
	(4, 1, 10),
	(5, 9, 10),
	(6, 13, 11),
	(7, 1, 13),
	(8, 5, 13),
	(9, 1, 14),
	(10, 4, 17),
	(11, 9, 17),
	(12, 1, 18),
	(13, 2, 18),
	(14, 5, 19),
	(15, 10, 20),
	(16, 11, 23),
	(17, 7, 25),
	(18, 9, 26),
	(19, 1, 27),
	(20, 2, 27),
	(21, 8, 28),
	(22, 3, 28),
	(23, 1, 30),
	(26, 12, 38),
	(27, 2, 41),
	(28, 16, 41),
	(29, 7, 43),
	(30, 5, 44),
	(31, 16, 45),
	(32, 4, 45),
	(33, 12, 47),
	(34, 5, 50),
	(35, 13, 50),
	(36, 12, 53),
	(37, 6, 53),
	(38, 13, 53),
	(39, 13, 54),
	(40, 11, 54),
	(41, 10, 55),
	(42, 13, 56),
	(43, 13, 56),
	(44, 1, 58);


--
-- Data for Name: fantasy_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fantasy_teams" ("id", "season_id", "user_id", "captain_id", "name") VALUES
	(10, 2, '3273c98f-bdc4-4897-a2e1-f288de739621', 4, 'Kamferdrops'),
	(13, 2, '6cafbfe0-327e-4128-810b-e5a719c80a43', 4, 'Knullegutta'),
	(12, 2, '1eaed85d-45cc-4714-b99c-4493de40196e', 4, 'Cheeseballers 2.0'),
	(9, 2, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2', 13, 'Dårlig Form AS'),
	(21, 2, 'b7fe24dd-02c1-453b-82a3-fadb9e39a149', 13, 'Lions of Kråkerøy'),
	(3, 1, '480cff16-f1be-49d8-8f71-b7cca47b5003', 10, 'RB Kråkerøy'),
	(22, 2, 'a45cffa0-8632-4fdd-961f-ffe982c70797', 3, 'Dommerjævel'),
	(15, 2, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5', 13, 'Jeg liker ikke grekere'),
	(23, 2, 'b2510879-8185-4325-9ab9-7ebaf8266d90', 4, 'Knullegutta Cavaliers'),
	(7, 1, '625a49da-008c-4d03-8d7f-143b97c7fdcf', 9, 'Varslingssakene'),
	(6, 1, '1eaed85d-45cc-4714-b99c-4493de40196e', 8, 'Cheese ballers'),
	(1, 1, '7e2d3c59-d70b-4583-a866-de0c2db784f5', 13, 'Beast FC'),
	(5, 1, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5', 13, 'I HENNES FELE'),
	(8, 1, '882a8d04-e064-4212-9742-e34dd6bc4df0', 4, 'Njårderudsaken'),
	(2, 1, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2', 8, 'Knullkene'),
	(16, 2, '261b8260-5b0b-4d8a-9fa3-fbf52dc7f629', 5, 'spyddeifjor'),
	(17, 2, '482392ac-977a-41a6-8de7-438d2eb52d28', 4, 'HiiiHaaaHooo'),
	(11, 2, '7e2d3c59-d70b-4583-a866-de0c2db784f5', 4, 'Jumboklubben'),
	(4, 1, '7334d785-564f-4024-86b9-61e13b901f08', 4, 'Driquepacké FC'),
	(18, 2, '480cff16-f1be-49d8-8f71-b7cca47b5003', 10, 'RB Kråkerøy'),
	(19, 2, '882a8d04-e064-4212-9742-e34dd6bc4df0', 8, 'Gamperæva'),
	(14, 2, '625a49da-008c-4d03-8d7f-143b97c7fdcf', 4, 'Varslingssakene'),
	(20, 2, 'ee297415-dee7-40da-afa4-6a44818d6ce1', 4, 'Storpikkmoen'),
	(24, 3, 'c13616ff-ebac-408c-9cdd-ef36b5a933a2', 4, 'Jernbusens Jernkjemper'),
	(33, 3, '8af15bb1-78eb-437c-b3b1-8b8337695449', 4, 'RB Smertulia'),
	(34, 3, '7e2d3c59-d70b-4583-a866-de0c2db784f5', 13, 'Kvakk & Knus'),
	(26, 3, '261b8260-5b0b-4d8a-9fa3-fbf52dc7f629', 4, 'Tactikællær'),
	(35, 3, 'b42fdfdb-91f2-4f08-ad06-5f087a649d49', 4, 'Kråkerøy Handicaps'),
	(29, 3, 'ee297415-dee7-40da-afa4-6a44818d6ce1', 4, 'Fionas Føll'),
	(27, 3, '9f5c628f-7330-4ae2-ae2a-44e95b047cd5', 13, 'Jeger i beger'),
	(25, 3, '3273c98f-bdc4-4897-a2e1-f288de739621', 4, 'Døm som ikke hopper døm er særpingær'),
	(28, 3, '6cafbfe0-327e-4128-810b-e5a719c80a43', 4, 'Los rølpos'),
	(37, 3, '7334d785-564f-4024-86b9-61e13b901f08', 4, 'Kråkerøy Headhunters'),
	(36, 3, '625a49da-008c-4d03-8d7f-143b97c7fdcf', 4, 'Er det ikke lov å klemme lenge heller nå??!'),
	(38, 3, 'a45cffa0-8632-4fdd-961f-ffe982c70797', 13, 'Ikke no’ kjærringbråk!'),
	(31, 3, '482392ac-977a-41a6-8de7-438d2eb52d28', 4, 'HiiiHaaaHooo'),
	(30, 3, 'b7fe24dd-02c1-453b-82a3-fadb9e39a149', 2, 'tbc'),
	(32, 3, '882a8d04-e064-4212-9742-e34dd6bc4df0', 4, 'Gauslaar alle');


--
-- Data for Name: fantasy_teams_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fantasy_teams_players" ("fantasy_team_id", "player_id") VALUES
	(23, 14),
	(23, 7),
	(23, 3),
	(23, 4),
	(9, 1),
	(9, 9),
	(9, 10),
	(9, 13),
	(1, 10),
	(1, 9),
	(1, 1),
	(1, 13),
	(3, 9),
	(3, 4),
	(3, 1),
	(3, 10),
	(16, 3),
	(16, 5),
	(16, 13),
	(16, 14),
	(17, 1),
	(17, 4),
	(17, 5),
	(17, 2),
	(5, 13),
	(5, 14),
	(5, 9),
	(5, 5),
	(11, 3),
	(11, 4),
	(11, 13),
	(11, 14),
	(4, 1),
	(4, 4),
	(4, 8),
	(4, 14),
	(8, 14),
	(8, 8),
	(8, 4),
	(8, 5),
	(2, 3),
	(2, 8),
	(2, 1),
	(2, 9),
	(10, 4),
	(10, 7),
	(10, 3),
	(10, 15),
	(13, 3),
	(13, 4),
	(13, 7),
	(13, 14),
	(18, 8),
	(18, 13),
	(18, 14),
	(18, 10),
	(7, 8),
	(7, 14),
	(7, 9),
	(7, 4),
	(19, 2),
	(19, 10),
	(19, 7),
	(19, 8),
	(21, 8),
	(21, 9),
	(21, 14),
	(21, 13),
	(6, 4),
	(6, 8),
	(6, 14),
	(6, 10),
	(12, 4),
	(12, 13),
	(12, 14),
	(12, 3),
	(14, 2),
	(14, 9),
	(14, 10),
	(14, 4),
	(20, 4),
	(20, 14),
	(20, 11),
	(20, 8),
	(22, 13),
	(22, 5),
	(22, 3),
	(22, 8),
	(15, 3),
	(15, 13),
	(15, 10),
	(15, 5),
	(24, 1),
	(24, 2),
	(24, 4),
	(24, 11),
	(33, 2),
	(33, 4),
	(33, 10),
	(33, 11),
	(34, 7),
	(34, 10),
	(34, 12),
	(34, 13),
	(26, 3),
	(26, 4),
	(26, 8),
	(26, 11),
	(37, 10),
	(37, 4),
	(37, 12),
	(37, 9),
	(29, 4),
	(29, 11),
	(29, 12),
	(29, 10),
	(36, 2),
	(36, 4),
	(36, 9),
	(36, 10),
	(31, 11),
	(31, 10),
	(31, 2),
	(31, 4),
	(35, 10),
	(35, 9),
	(35, 1),
	(35, 4),
	(27, 5),
	(27, 9),
	(27, 12),
	(27, 13),
	(32, 9),
	(32, 4),
	(32, 3),
	(32, 8),
	(38, 16),
	(38, 12),
	(38, 13),
	(38, 3),
	(25, 7),
	(25, 4),
	(25, 3),
	(25, 1),
	(30, 2),
	(30, 16),
	(30, 7),
	(30, 10),
	(28, 3),
	(28, 4),
	(28, 7),
	(28, 12);


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."goals" ("id", "match_id", "goal_player_id", "assist_player_id") VALUES
	(1, 2, 9, 5),
	(2, 2, 3, 13),
	(3, 2, 3, 3),
	(4, 2, 3, 13),
	(5, 2, 5, 5),
	(6, 2, 5, 5),
	(7, 2, 10, 10),
	(8, 2, 14, 5),
	(9, 2, 10, 13),
	(10, 2, 13, 3),
	(11, 2, 14, 5),
	(12, 2, 14, 14),
	(13, 3, 14, 5),
	(14, 3, 9, 14),
	(15, 3, 1, 1),
	(16, 3, 4, 4),
	(17, 3, 5, 14),
	(18, 3, 8, 4),
	(19, 3, 1, 8),
	(20, 3, 1, 4),
	(21, 3, 5, 9),
	(22, 1, 13, 10),
	(23, 1, 10, 13),
	(24, 1, 10, 3),
	(25, 1, 3, 10),
	(26, 1, 3, 13),
	(27, 1, 4, 8),
	(28, 1, 3, 10),
	(29, 5, 10, 3),
	(30, 5, 3, 13),
	(31, 5, 10, 13),
	(32, 5, 10, 3),
	(33, 6, 14, 9),
	(34, 6, 5, 5),
	(35, 6, 14, 9),
	(36, 6, 4, 8),
	(37, 6, 9, 9),
	(38, 6, 4, 1),
	(39, 7, 4, 1),
	(40, 7, 10, 13),
	(41, 7, 13, 3),
	(42, 7, 8, 8),
	(43, 7, 10, 3),
	(44, 7, 13, 10),
	(45, 8, 13, 3),
	(46, 8, 3, 13),
	(47, 8, 10, 3),
	(48, 8, 5, 14),
	(49, 8, 9, 5),
	(50, 8, 3, 13),
	(51, 9, 8, 4),
	(52, 9, 8, 4),
	(53, 9, 10, 10),
	(54, 9, 13, 3),
	(55, 9, 4, 4),
	(56, 9, 10, 13),
	(57, 10, 5, 5),
	(58, 10, 4, 8),
	(59, 10, 1, 1),
	(60, 10, 5, 9),
	(61, 10, 4, 1),
	(62, 11, 13, 13),
	(63, 11, 3, 13),
	(64, 11, 3, 10),
	(65, 11, 3, 10),
	(66, 11, 14, 5),
	(67, 11, 3, 3),
	(68, 11, 13, 13),
	(69, 12, 3, 3),
	(70, 12, 3, 10),
	(71, 12, 1, 4),
	(72, 12, 10, 3),
	(73, 12, 4, 8),
	(74, 13, 14, 9),
	(75, 13, 8, 8),
	(76, 13, 4, 4),
	(77, 14, 4, 8),
	(78, 14, 4, 4),
	(79, 14, 4, 4),
	(80, 1, 1, 8),
	(82, 17, 9, 11),
	(83, 18, 13, 2),
	(84, 18, 2, NULL),
	(85, 19, 8, 13),
	(86, 19, 7, 5),
	(87, 20, 4, NULL),
	(88, 20, 4, 11),
	(89, 21, 4, 14),
	(90, 21, 14, 11),
	(91, 22, 10, 7),
	(92, 22, 10, 3),
	(93, 22, 2, 13),
	(94, 23, 10, 7),
	(95, 23, 4, NULL),
	(96, 24, 11, 9),
	(97, 25, 5, 10),
	(98, 26, 7, 3),
	(99, 26, 11, 4),
	(100, 27, 13, 1),
	(101, 27, 8, 2),
	(102, 27, 2, NULL),
	(103, 28, 8, NULL),
	(104, 29, 11, 4),
	(105, 29, 9, 4),
	(106, 29, 4, 14),
	(107, 30, 1, 13),
	(108, 30, 9, 14),
	(109, 30, 4, 14),
	(110, 30, 4, 11),
	(120, 38, 16, 8),
	(121, 39, 4, 9),
	(123, 39, 13, 7),
	(124, 43, 4, 10),
	(125, 44, 7, 13),
	(126, 45, 4, 1),
	(127, 45, 2, 16),
	(128, 45, 10, 4),
	(129, 48, 4, 3),
	(130, 49, 8, 16),
	(131, 50, 13, NULL),
	(132, 50, 8, 12),
	(133, 51, 9, NULL),
	(134, 51, 10, 1),
	(135, 51, 13, 7),
	(136, 52, 2, 8),
	(137, 52, 10, 4),
	(138, 53, 13, NULL),
	(139, 55, 10, NULL),
	(140, 55, 9, NULL),
	(141, 56, 2, 6),
	(142, 57, 13, NULL),
	(143, 57, 4, 9),
	(144, 57, 13, 5),
	(145, 58, 10, 3),
	(146, 58, 2, 12),
	(147, 58, 1, NULL);


--
-- Data for Name: players_seasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."players_seasons" ("player_id", "season_id", "attack", "defence", "physical", "morale", "price", "skill", "inform_image", "outofform_image") VALUES
	(1, 1, 53, 61, 65, 70, 4200, 65, NULL, NULL),
	(4, 1, 92, 84, 76, 68, 6700, 81, NULL, NULL),
	(5, 1, 64, 83, 57, 74, 4900, 77, NULL, NULL),
	(8, 1, 68, 61, 82, 80, 5100, 64, NULL, NULL),
	(9, 1, 57, 71, 74, 71, 4600, 72, NULL, NULL),
	(10, 1, 75, 53, 93, 46, 4500, 68, NULL, NULL),
	(13, 1, 84, 76, 78, 72, 6500, 95, NULL, NULL),
	(14, 1, 42, 51, 92, 82, 3300, 44, NULL, NULL),
	(3, 1, 48, 62, 46, 94, 5600, 50, NULL, NULL),
	(1, 2, 53, 61, 65, 70, 4200, 65, NULL, NULL),
	(4, 2, 92, 84, 76, 68, 6700, 81, NULL, NULL),
	(5, 2, 64, 83, 57, 74, 4900, 77, NULL, NULL),
	(7, 2, 74, 88, 70, 70, 6100, 68, NULL, NULL),
	(8, 2, 68, 61, 82, 80, 5100, 64, NULL, NULL),
	(9, 2, 57, 71, 74, 71, 4600, 72, NULL, NULL),
	(10, 2, 75, 53, 93, 46, 4500, 68, NULL, NULL),
	(13, 2, 84, 76, 78, 72, 6500, 95, NULL, NULL),
	(15, 2, 52, 64, 60, 68, 3900, 61, NULL, NULL),
	(11, 2, 49, 65, 67, 86, 4100, 52, NULL, NULL),
	(3, 2, 48, 62, 46, 78, 3300, 50, NULL, NULL),
	(14, 2, 42, 51, 92, 94, 3500, 41, NULL, NULL),
	(2, 2, 65, 43, 62, 89, 4200, 45, NULL, NULL),
	(6, 5, 61, 63, 53, 69, 4100, 73, '', 'https://i.imgur.com/p9FU7cc.png'),
	(10, 5, 80, 54, 88, 45, 4700, 76, 'https://i.imgur.com/JnfpRHy.png', ''),
	(11, 5, 56, 54, 62, 89, 3700, 49, '', ''),
	(2, 5, 80, 40, 71, 89, 4500, 49, '', ''),
	(5, 5, 58, 71, 60, 72, 4000, 61, '', ''),
	(13, 5, 85, 76, 77, 70, 6700, 90, '', ''),
	(4, 5, 93, 78, 79, 70, 6600, 77, '', ''),
	(9, 5, 63, 73, 75, 76, 5100, 77, '', ''),
	(7, 5, 65, 76, 66, 71, 4900, 69, '', ''),
	(16, 5, 79, 65, 84, 78, 5800, 70, '', ''),
	(3, 5, 51, 54, 50, 89, 3500, 39, '', ''),
	(1, 5, 58, 64, 68, 72, 4200, 61, '', ''),
	(8, 5, 71, 67, 82, 81, 5300, 64, '', ''),
	(12, 5, 58, 61, 87, 49, 4100, 67, '', ''),
	(15, 5, 50, 61, 69, 67, 3600, 58, '', ''),
	(10, 3, 75, 53, 84, 31, 4200, 71, NULL, NULL),
	(2, 3, 71, 41, 65, 89, 4200, 48, NULL, NULL),
	(16, 3, 85, 64, 84, 81, 6200, 71, NULL, NULL),
	(3, 3, 48, 48, 48, 89, 3400, 42, NULL, NULL),
	(8, 3, 68, 61, 82, 80, 5100, 64, NULL, NULL),
	(5, 3, 64, 83, 57, 74, 4900, 72, NULL, NULL),
	(7, 3, 70, 82, 67, 72, 5400, 65, NULL, NULL),
	(6, 3, 72, 74, 57, 64, 4900, 83, NULL, NULL),
	(9, 3, 57, 71, 74, 71, 4600, 72, NULL, NULL),
	(13, 3, 76, 74, 78, 72, 6100, 85, NULL, NULL),
	(4, 3, 92, 84, 76, 68, 6900, 81, NULL, NULL),
	(12, 3, 62, 64, 87, 56, 4300, 61, NULL, NULL),
	(1, 3, 53, 61, 65, 70, 3900, 65, NULL, NULL),
	(11, 3, 56, 65, 69, 86, 4400, 58, 'https://i.imgur.com/O4b0bvY.png', NULL);


--
-- Data for Name: teams_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."teams_players" ("player_id", "team_id", "id") VALUES
	(1, 1, 4),
	(8, 1, 5),
	(4, 1, 6),
	(14, 3, 10),
	(5, 3, 11),
	(9, 3, 12),
	(3, 2, 13),
	(13, 2, 14),
	(10, 2, 15),
	(9, 5, 20),
	(14, 5, 21),
	(4, 5, 22),
	(11, 5, 23),
	(1, 4, 33),
	(8, 4, 34),
	(13, 4, 35),
	(2, 4, 36),
	(7, 6, 37),
	(5, 6, 38),
	(3, 6, 39),
	(10, 6, 40),
	(1, 7, 54),
	(10, 7, 55),
	(9, 7, 56),
	(3, 7, 57),
	(4, 7, 58),
	(6, 8, 59),
	(2, 8, 60),
	(12, 8, 61),
	(16, 8, 62),
	(8, 8, 63),
	(13, 9, 64),
	(11, 9, 65),
	(5, 9, 66),
	(7, 9, 67),
	(16, 14, 100),
	(7, 14, 101),
	(8, 14, 102),
	(3, 14, 103),
	(12, 14, 104),
	(4, 13, 105),
	(1, 13, 106),
	(2, 13, 107),
	(6, 13, 108),
	(11, 13, 109),
	(13, 12, 110),
	(15, 12, 111),
	(9, 12, 112),
	(10, 12, 113),
	(5, 12, 114);


--
-- Name: bets_against_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."bets_against_id_seq"', 23, true);


--
-- Name: bets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."bets_id_seq"', 18, true);


--
-- Name: clutches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."clutches_id_seq"', 44, true);


--
-- Name: fantasy_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."fantasy_teams_id_seq"', 38, true);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."goals_id_seq"', 147, true);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."matches_id_seq"', 59, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."players_id_seq"', 16, true);


--
-- Name: seasons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."seasons_id_seq"', 5, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."teams_id_seq"', 14, true);


--
-- Name: teams_players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."teams_players_id_seq"', 114, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
