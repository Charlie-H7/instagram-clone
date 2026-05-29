// create helper functions for the 'posts' table
// import { ser }
import { SupabaseClient } from "@supabase/supabase-js"


//Create typings based on table I use from supabase
export type PostRow = {
    id: string;
    user_id: string;
    caption: string; // I don't think I need to make like a thing here for the caption as insta doesn't have a caption
    image_path: string;
    date: string;
}

export type PostFetch = {
    id: string; // post id
    username: string;
    user_id: string;
    image_path: string;
    pfp_path: string;
    like_count: number;
    is_liked: boolean;
    // will include other data I actually need later
}

// 1. Need to be able to submit posts to the db for others to see
// 2. Need to be able to fetch posts based on if you are following people or not

// Policies only allow people to submit their own posts so no additional logic
export async function uploadPost(supabase: SupabaseClient, {id, user_id, image_path}: PostRow) {
    const { data, error } = await supabase.from("posts")
    .insert({
        id,
        user_id,
        image_path,
    })

    if(error){ console.log(error.message); return; }
}


// // I don't like this, it doesn't explicityly join on where the poster is the person I'm following
// export async function fetchFeedPosts(supabase: SupabaseClient, {id, user_id, image_path}){
//     const { data, error } = await supabase.from("posts").select(
//         `
//         id,
//         user_id,
//         users!inner (name,id),
//         following!inner(),
//         following!following_following_id_fkey!inner()
//         `
//     ).neq("user_id", user_id) // Get Posts where user is not the poster (shouldn't see own pages on home)
//     .eq("following.follower_id", user_id) // Get the posts where {id} (user) is a follower of others
//     .eq("following.approved",true);
//     // Need to match

// }

// New version using a view because supabase js sucks at complicated joins
export async function fetchFeedPosts(supabase: SupabaseClient){
    // const { data, error } = await supabase.from("feed_posts").select("*");
    const { data, error } = await supabase.from("feed_posts").select("*");
    
    if(error){
        console.log(error.message);
        return;
    }
    return data;
}


// What actually works in Supabase JS

// You already had the closest valid version:

// const { data, error } = await supabase
//   .from("posts")
//   .select(`
//     id,
//     user_id,
//     users!inner(*),
//     following!inner(*)
//   `)
//   .eq("following.follower_id", user_id)
//   .eq("following.approved", true)
//   .neq("user_id", user_id);

// BUT IMPORTANT:

// This only works if Postgres can infer:

// posts.user_id → users.id → following.following_id

// If it cannot infer that path cleanly, Supabase will NOT correctly enforce:

// “post author must equal followed user”