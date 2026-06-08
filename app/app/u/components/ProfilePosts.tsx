"use client"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useState, useEffect, useCallback, useMemo } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

// This will be an infinite scroll for fetching posts on the user page
type ProfilePostProps = {
    user_id: string;
}

const PAGE_SIZE = 10; // Load 10 posts per page
export default async function ProfilePosts({user_id}: ProfilePostProps){
    // State
    const supabase = useMemo( () => createBrowserSupabaseClient(), [] )
    const [posts, setPosts] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [initialPage, SetInitialPage] = useState<boolean>(true); // boolean to tell us if it is the first page to render
    const [hasMore, setHasMore] = useState<boolean>(false); // tell us if there is more pages that can be rendered

    const fetchPosts = useCallback(async () =>{
        // fetch posts here
        const { data } = await supabase.from("feed_posts").select("*").eq("user", user_id);
        const row_from = page * PAGE_SIZE;
        const row_to = (page + PAGE_SIZE) * PAGE_SIZE;

        // Asume theres an on click that changes the page object
        const temp = [...posts, ]

     },[supabase, user_id])

     // what I would like is for the purpose of resseting state if the user visits a new profile page 
     // (This only matters if there is a way to view other users without re-routing)
    useEffect(() => {
        setPosts([]);
        setPage(0);
        SetInitialPage(true);
        setHasMore(false);
    },[fetchPosts])

    
    // const { data } = supabase.from("feed_posts").select()

    // Get profile post from supabase and edit them
    return(
        <InfiniteScroll 
        next={fetchPosts}
        hasMore={hasMore}
        loader={(<div>Loading Posts</div>)}
        dataLength={posts.length}
        >
            <div>posts here</div>
        </InfiniteScroll>
    );
    
}