"use client"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useState, useEffect, useCallback, useMemo, DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Image from "next/image"

// This will be an infinite scroll for fetching posts on the user page
type ProfilePostProps = {
    user_id: string;
}

const PAGE_SIZE = 10; // Load 10 posts per page
export default function ProfilePosts({user_id}: ProfilePostProps){
    // State
    const supabase = useMemo( () => createBrowserSupabaseClient(), [] )
    const [posts, setPosts] = useState<any[]>([])
    const [page, setPage] = useState(0)
    const [initialPage, setInitialPage] = useState<boolean>(true); // boolean to tell us if it is the first page to render
    const [loadingMore, setLoadingMore] = useState<boolean>(false); // Bool to tell us if its not initial render (i mean I could just check by !initial render no? well whatever)
    const [hasMore, setHasMore] = useState<boolean>(false); // tell us if there is more pages that can be rendered

    const fetchPosts = useCallback(async (next_page: number) =>{
        if (next_page === 0) setInitialPage(true)
        else {
            setInitialPage(false);
            setLoadingMore(true); 
        }
        // fetch posts here
        const row_from = next_page * PAGE_SIZE;
        const row_to = row_from + PAGE_SIZE - 1
        
        const { data, error } = await supabase.from("feed_posts").select("*").eq("user_id", user_id).range(row_from, row_to);
        if(error){
            throw new Error(error.message);
        }
        if(data){
            // Assume theres an on click that changes the page object
            // setPosts( () => {
            //     const temp = next_page === 0 ? data : [...posts, data];
            //     return (temp);
            // })
            setPosts(prev => next_page === 0 ? data : [...prev, ...data]);
            
            // After fetching from the table we have to check if there is potentially more to fetch from each
            setHasMore(data.length === PAGE_SIZE)
            setPage(next_page + 1);
        }
        setInitialPage(false);
        setLoadingMore(false);
     },[supabase, user_id])

     // what I would like is for the purpose of resseting state if the user visits a new profile page 
     // (This only matters if there is a way to view other users without re-routing)
    // useEffect(() => {
    //     setPosts([]);
    //     setPage(0);
    //     setHasMore(true);
    //     fetchPosts(0);
    // },[fetchPosts])
    useEffect(() => {
        setPosts([]);
        setPage(0);
        setHasMore(true);
        fetchPosts(0);
    }, [user_id]);


    const loadMorePosts = async () => {
        if (!hasMore || loadingMore) return; 
        await fetchPosts(page);
    }

    
    // const { data } = supabase.from("feed_posts").select()

    // Get profile post from supabase and edit them
    return(
    <div id="post-scrollable" className="h-full overflow-y-auto pr-1">
        <InfiniteScroll 
        next={loadMorePosts}
        hasMore={hasMore}
        dataLength={posts.length}
        loader={(<div>Loading Posts</div>)}
        endMessage={
          <p className="py-4 text-center text-sm text-slate-500">
            No more comments.
          </p>
        }
        // Use the wrapper div as the scrollable container.
        scrollableTarget="post-scrollable"
        style={{ overflow: "hidden" }}
        >
            <div className="max-w-xl mx-auto grid grid-cols-3 gap-1">
                {posts.map((post) => (
                    <div
                    key={post.id}
                    className="relative aspect-square"
                    >
                        <Image
                            src={
                                supabase.storage
                                    .from("posts")
                                    .getPublicUrl(post.image_path)
                                    .data.publicUrl
                            }
                            alt="Post"
                            fill
                            className="object-cover"
                        />
                    </div>
        
                ))}
        </div>

            
        </InfiniteScroll>
        </div>

    );
    
}