alter table "public"."seasons" add column "points_per_assist" smallint not null default '1'::smallint;

alter table "public"."seasons" add column "points_per_clean_sheet" smallint not null default '1'::smallint;

alter table "public"."seasons" add column "points_per_clutch" smallint not null default '1'::smallint;

alter table "public"."seasons" add column "points_per_goal" smallint not null default '1'::smallint;

alter table "public"."seasons" add column "points_per_win" smallint not null default '1'::smallint;


