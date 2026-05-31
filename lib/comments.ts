import { SupabaseClient } from "@supabase/supabase-js";

export type NewComment = {
    post_id: string,
    user_id: string,
    parent_comment_id?: string | null,
    comment: string
};

export async function addNewComment(supabase: SupabaseClient, {post_id, user_id, parent_comment_id, comment}: NewComment){
    const {error} = await supabase.from("comments").insert({
        post_id,
        user_id,
        parent_comment_id,
        comment,
    })
    return(error);
}