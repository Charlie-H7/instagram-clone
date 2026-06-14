import { SupabaseClient } from "@supabase/supabase-js";

export async function unfollowUser(
    supabase: SupabaseClient,
    followerId: string,
    followingId: string
) {
    const { error } = await supabase
        .from("following")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

    if (error) {
        throw error;
    }
}