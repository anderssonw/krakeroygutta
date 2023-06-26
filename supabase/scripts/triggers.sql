alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.users USING btree (id);

-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username)
  values (new.id, new.raw_user_meta_data::json->>'username');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users are viewable by users who created them."
  on users for select
  using ( auth.uid() = id );