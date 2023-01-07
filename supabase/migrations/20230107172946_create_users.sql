create table "public"."users" (
    "id" uuid not null,
    "is_admin" boolean not null default false,
    "username" character varying not null
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.users (id, username)
  values (new.id, new.raw_user_meta_data::json->>'username');
  return new;
end;
$function$
;

create policy "Profiles are viewable by users who created them."
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));



