alter table "public"."goals"
drop constraint goals_match_id_fkey;

alter table "public"."goals"
add constraint goals_match_id_fkey foreign key (match_id) references "public"."matches" (id)
  on delete cascade;

alter table "public"."clutches"
drop constraint clutches_match_id_fkey;

alter table "public"."clutches"
add constraint clutches_match_id_fkey foreign key (match_id) references "public"."matches" (id)
  on delete cascade;