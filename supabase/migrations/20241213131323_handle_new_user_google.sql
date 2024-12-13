CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.users (id, nickname)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$
;