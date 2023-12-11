alter table "public"."users" add column "player_id" bigint;

alter table "public"."users" add constraint "users_player_id_fkey" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL not valid;

alter table "public"."users" validate constraint "users_player_id_fkey";



