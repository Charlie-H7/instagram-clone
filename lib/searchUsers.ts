import { SupabaseClient } from "@supabase/supabase-js";

export async function searchUsers(supabase: SupabaseClient, query: string) {
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .ilike("username", `%${query}%`)
    .limit(5);

  return data || [];
}