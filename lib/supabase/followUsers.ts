import { SupabaseClient } from "@supabase/supabase-js";

export async function followUser(
    supabase: SupabaseClient,
    followerId: string,
    followingId: string
) {
    const { error } = await supabase
        .from("following")
        .insert({
            follower_id: followerId,
            following_id: followingId,
        });

    if (error) {
        throw error;
    }
}