import { SupabaseClient } from "@supabase/supabase-js";

// does a substring search for usernames that start with 'query'
export async function searchUsers(supabase: SupabaseClient, query: string) {
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .ilike("username", `%${query}%`)
    .limit(5);

  return data || [];
}