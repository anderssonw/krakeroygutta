import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad<{ test: string }> = async (event) => {

    //const { supabaseClient } = await getSupabase(event);
	//const seasonQuery = await supabaseClient.from('season').select();
    //console.log(seasonQuery);

    return { test: "" }

}