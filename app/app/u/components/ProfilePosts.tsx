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
    
    // <article
    //   key={post.id}
    //   className="bg-white border border-slate-200 rounded-lg overflow-hidden"
    // >
    //   {/* Header */}
    //   <div className="flex items-center gap-3 p-3">
    //     <div className="w-8 h-8 rounded-full bg-slate-300" />
    //     <span className="font-medium text-sm">
    //       username
    //     </span>
    //   </div>

    //   {/* Image */}
    //   <div className="relative aspect-square">
    //     <Image
    //       src={
    //         supabase.storage
    //           .from("posts")
    //           .getPublicUrl(post.image_path)
    //           .data.publicUrl
    //       }
    //       alt=""
    //       fill
    //       className="object-cover"
    //     />
    //   </div>

    //   {/* Actions */}
    //   <div className="flex gap-4 p-3">
    //     ❤️
    //     💬
    //     📤
    //   </div>

    //   {/* Caption */}
    //   <div className="px-3 pb-3">
    //     <p className="text-sm">
    //       <span className="font-semibold mr-2">
    //         username
    //       </span>
    //       Caption here...
    //     </p>
    //   </div>

    //   {/* Date */}
    //   <div className="px-3 pb-3 text-xs text-slate-500">
    //     {new Date(post.date).toLocaleDateString()}
    //   </div>
    // </article>
  ))}
</div>
            
                                    {/* <div className="flex flex-col gap-4">
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm"
                                        >
                                            <p className="text-sm text-slate-800">
                                                {post.id}
                                            </p>
                                            <div className="relative w-full h-[32rem] bg-slate-100">
                                                <Image src={supabase.storage.from("posts").getPublicUrl(post.image_path).data.publicUrl} 
                                                alt="Post image" fill className="" />
                                            </div>

                                            <div className="mt-2 text-xs text-slate-500">
                                                {new Date(post.date).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    </div> */}
        </InfiniteScroll>
    );
    
}