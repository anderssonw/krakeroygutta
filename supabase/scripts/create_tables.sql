create table seasons (
  sid bigint generated by default as identity primary key,
  name text,
  start_date timestamp,
  end_date timestamp
);

create table players (
  pid bigint generated by default as identity primary key,
  name text,
  price int,
  image text,
  goals int,
  assist int,
  clutch int
);

create table teams (
  tid bigint generated by default as identity primary key,
  sid bigint references public.seasons,
  name text,
  wins int,
  draws int,
  losses int
);