"use client"
import { useEffect, useState } from "react"
import { SupabaseClient } from "@supabase/supabase-js"
import InfiniteScroll from "react-infinite-scroll-component";


// Simply takes in all a post, joins on users to get their info, thats it nothing else
// Since this is a client component that is trying to do an async action (fetch comments)
// I have 2 option, 1. no async and just pass in comments from server component page.tsx (don't like this)
// 2. use useEffect to fetch the data to render(prefer this as I want to end up using like an infinite scroll mechanism)
// hmmm might be better to have this to just fetch an arbity query, track how many have been fetched and scrolled; s.t. this is like "CommentShell" and this calls component "Comment" just passing relevant data (comment text, username, etc...) to render one; BUT THATS JUST A THEORY. A GAME THEORY!

type PostProps = {
    supabase: SupabaseClient;
    post_id: string;
};

export default function CommentSection({supabase, post_id}: PostProps){
    const [loading, setLoading] = useState<boolean>(true); // A tracker to determine if the query processed
    const [ commentList, setList ] = useState<any[]>([]); //sdionfjngon :'v

    // state maybe on how many comments AND replies (deal with replies later) have loaded

    // Code to render AFTER initial mount (render)
    // Ignore real time comments for now..., -> solution for later fetch and filter comments on a timer, 2. supabase supscription, like on change.
    useEffect(() =>{
        //query join on users
        // update state
        // for right now just fetch all comment info
        // const { data } = supabase.from("comments").select(
        //     `
        //     *,
        //     post_id!inner(id),
        //     `
        // ).eq("comments.post_id", post_id)
        const fetchMore = async () => {
            const { data } = await supabase.from("comments").select(
                `*`
            ).eq("comments.post_id", post_id)
            // update any state here
            if(!data) return;
            setList([...commentList, ...data]); // extend the comment list
        }

        fetchMore();

        // clearing thing should reset states, and mark any busy trackers (if used to false)
    },[supabase, post_id]);

    return(
        <div>
            <InfiniteScroll dataLength={1} next={fetchMore} hasMore={}  loader={}>
                
            </InfiniteScroll>
        </div>
    )
}
