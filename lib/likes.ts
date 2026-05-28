// import { createClient } from "./supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type likeTypes = {
    user_id: string;
    post_id: string;
}

export async function likePost( supabase: SupabaseClient,  {user_id, post_id}: likeTypes){
    // const supabase = await createClient();
    //should know if a post is already liked or unliked // question is should i break it into separate function, prolly not
    // my options are render something different based on some fact (conditionally render if liked or not in actual html)`?` and have diff on change for each; OR check like db and determine what action to takeso have both in one function
    // I personally lead towards the latter, that feels more intuitive
    const is_liked: boolean;

    // Check if the user liked the post already
    const { data } = await supabase.from("likes")
    .select("user_id, post_id")
    .eq("user_id", user_id)
    .eq("post_id",post_id)
    .maybeSingle(); // Returns 0 or 1 object

    // if they have, add it
    if(data){
        const { error } = await supabase.from("likes").insert({user_id, post_id});
        if (error){ console.log(error.message); return;}
    }
    else if(!data){ // otherwise if they already liked it then delete the like
        const{ error } = await supabase.from("likes")
        .delete()
        .eq("user_id",user_id)
        .eq("post_id", post_id); // composite key so both conditions should hold
        
        if(error){ console.log(error.message); return;}
    }
    
}

