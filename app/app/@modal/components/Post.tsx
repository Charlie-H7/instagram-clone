"use client"
import { SupabaseClient } from "@supabase/supabase-js"


export default function Post(supabase: SupabaseClient, post_id: string){
    // could add double tap functionality later

    // Select a single one from feed posts where the conditional is on post id
    const { data } = async () => { await supabase.from("feed_posts").select("*").eq("id", post_id)};
    // async function fetchPost(){
    //     const { data } = await supabase.from("feed_posts").select("*").eq("id", post_id);
    // }

}