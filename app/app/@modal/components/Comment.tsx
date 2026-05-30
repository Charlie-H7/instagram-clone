"use client"
import { useEffect, useState } from "react"
import { SupabaseClient } from "@supabase/supabase-js"

// Simply takes in all a post, joins on users to get their info, thats it nothing else
// Since this is a client component that is trying to do an async action (fetch comments)
// I have 2 option, 1. no async and just pass in comments from server component page.tsx (don't like this)
// 2. use useEffect to fetch the data to render(prefer this as I want to end up using like an infinite scroll mechanism)

type PostProps = {
    supabase: SupabaseClient;
    post_id: string;
};

export default function Comment({supabase, post_id}: PostProps){
    const [loading, setLoading] = useState<boolean>(true); // A tracker to determine if the query processed
    // state maybe on how many comments AND replies (deal with replies later) have loaded

    // Code to render AFTER initial mount (render)
    useEffect(() =>{
        //query join on users
        // update state

        // clearing thing should reset states, and mark any busy trackers (if used to false)
    },[])
}

// hmmm might be better to have this to just fetch an arbity query, track how many have been fetched and scrolled; s.t. this is like "CommentShell" and this calls component "Comment" just passing relevant data (comment text, username, etc...) to render one; BUT THATS JUST A THEORY. A GAME THEORY!