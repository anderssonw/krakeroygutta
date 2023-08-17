import { createClient } from '@supabase/auth-helpers-sveltekit';

export const supabase = createClient(import.meta.env.VITE_PUBLIC_SUPABASE_URL, import.meta.env.VITE_PUBLIC_SUPABASE_KEY);
