//lowkey could just get rid of feed and make this like the home page tsx for the /app directory no??
"use client"
import { useCallback, useMemo, useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
import { PostRow,PostFetch } from "@/lib/posts";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

import PostLikeButton from "./Like";

// Okay so here is what I need to know about creating with infiniteScroll
    // States: 
    /*
    InfiniteScroll:
        PAGE_SIZE -> A constant that shows how many posts should appear per section
        page -> which like page we are on
        Array state of posts -> iterated over to print the array
        state hasMore: <bool> of if there is more that could be fetched
        state initialLoad: this is just a state used for the inital fetch of supabase; then becomes !initialLoad
        LoadingMore: if page is being loaded after inital

    Trackers:
        isLiked, LikeCount
    */
export type FeedTypes = {
    caption: string;
    date: string; // ISO date string
    following_id: string;
    id: string;
    image_path: string;
    is_liked: boolean;
    like_count: number;
    name: string;
    pfp_path: string;
    user_id: string;
    username: string;
}

const PAGE_SIZE = 10;

// export default function Feed({id: post_id, username, image_path, pfp_path, like_count, is_liked, user_id}: PostFetch){
export default function Feed(){
    const supabase = useMemo( () => createBrowserSupabaseClient(), []);
    // const user_id = {async () => await supabase.auth.getUser().data.id}
    // const [isLiked, setLiked] = useState<boolean>(is_liked);
    // const [likeCount, setLikeCount] = useState<number>(like_count);
    const [isLiked, setLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);

    // InfiniteScroll
    const [page, setPage] = useState<number>(0); // the current page
    const [posts, setPosts] = useState<FeedTypes[]>([]); // get a specific typing/data struct later
    const [hasMore, setHasMore] = useState<boolean>(true);

        // Posts loading trackers
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // const obj = map
    // make a storage object for supabase
    // const pfp = { data: storageObj } = supabase.storage.from("pfp") -> to use state maybe (or maybe let, cant be const so  val can change)
    const fetchPosts = useCallback( async (nextPage: number) => {  // not too sure what the hell the parameter is in this case... like self referential im guessing like .this
        // Check if it is the first page to render
        if(nextPage === 0){
            // Set that it has to be the initial load
            setInitialLoading(true);
        }
        else { // Otherwise it is subsequent page loads and we should wait
            setLoadingMore(true);
            setInitialLoading(false);
        }

        // Get the offset of records the location of the records we would need to get from the 
        const from = nextPage * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        
        // Make a fetch from the post table
        // const { data, error } = await supabase.from("feed_posts").select("*").eq("id", user_id); // Wait why the hell did I do eq here
        const { data, error } = await supabase.from("feed_posts").select("*").range(from, to);
        if(error){
            throw new Error(error.message);
        }

        // add new thing to data


        // if no error then make the post end 
        // Extend posts, by len of PAGE_SIZE
        if(data){    
            setPosts( (prev) => { // hmmm, should note down array extension
                // const temp =  data ? [...prev, ...data];
                const temp = nextPage === 0 ? data : [...prev, ...data];
                return(temp);
            });
            // If we got a full page, there might still be more.
            setHasMore(data.length === PAGE_SIZE);
            setPage(nextPage + 1);
        }

        setInitialLoading(false);
        setLoadingMore(false);
        return;
    },[supabase]);

    useEffect(() => {
    // Reset state whenever post_id or supabase changes,
    // then fetch the first page of comments.
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchPosts(0);
    }, [fetchPosts]);

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore) return;
    await fetchPosts(page);
  };

    // make state updates before async functions to prevent like the 
    // async function handleLike(post_id: string) {
    //     const user_id = (await supabase.auth.getUser()).data.user?.id
    //     if (!user_id){
    //         return; // ideally reroute for home
    //     }
    //     const prev_liked = isLiked;
    //     const prev_like_count = likeCount;

    //     let error;

    //     // update the liked state so changes show up
    //     setLiked(!prev_liked);
    //     console.log(`state like ${isLiked}; prev_liked ${prev_liked}`);

    //     if (prev_liked) {
    //         setLikeCount(likeCount-1);
    //         error = await unlikePost(supabase, { user_id, post_id });
    //     } 
    //     else {
    //         setLikeCount(likeCount+1);
    //         error = await likePost(supabase, { user_id, post_id });
    //     }

    //     if(error) {setLiked(prev_liked); setLikeCount(prev_like_count)} //If there is a problem with the liked db, reset the liked status
    // }


            // const { data: pfp_storage_obj } = supabase.storage
            // .from("pfp")
            // .getPublicUrl(pfp_path)

            // const { data: post_storage_obj } = supabase.storage
            // .from("posts")
            // .getPublicUrl(image_path)

            // // if (error) console.log(error.)

            // const pfp_public_url = pfp_storage_obj.publicUrl;
            // const post_public_url = post_storage_obj.publicUrl;
            // console.log(post_public_url)

    return(
        <div className="w-full">
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={hasMore}
                loader={
                <div className="py-4 text-center text-sm text-slate-400">
                    Loading more comments...
                </div>
                }
                endMessage={
                <p className="py-4 text-center text-sm text-slate-500">
                    No more comments.
                </p>
                }
                // Use the wrapper div as the scrollable container.
                scrollableTarget="comment-scrollable"
                style={{ overflow: "hidden" }}
            >
            {posts.map((post) => (
                
                <div key={post.id} className="w-full max-w-3xl mx-auto mb-8 overflow-hidden border border-slate-200 shadow-sm">

                    {/* {console.log("shize")}
                    {console.log(posts)} */}


                    {/* <div>{user_id}</div> */}
                    {/* <div>{image_path}</div> */}
                    {/* <div>{pfp_path}</div> */}
                    {/* <Image src={pfp_public_url} alt={`${username} pfp`} className="w-16 h-16 rounded-full object-cover" fill/> */}
                    <div className="flex flex-row items-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Link href={`/app/u/${post.username}`} className="">
                                <Image
                                    src={supabase.storage.from("pfp").getPublicUrl(post.pfp_path).data.publicUrl}
                                    alt={`${post.username} pfp`}
                                    fill
                                    className="object-cover"
                                    />
                            </Link>
                            </div>
                            <div className="items-center">{post.username}</div>
                    </div>
                    {/* The best course here would be to make the table private to prevent serving images with urls but for right now you have access to all data */}
                    {/* <div className="relative w-full h-[32rem] bg-slate-100"> */}
                    <div className="relative w-full h-[32rem] bg-slate-100">
                        {/* <Image src={post_public_url} alt="Post image" fill className="object-cover" /> */}
                        {/* <Image src={post_public_url} alt="Post image" fill className="" /> */}
                        <Image 
                            src={supabase.storage.from("posts").getPublicUrl(post.image_path).data.publicUrl} 
                            alt="Post image" fill className="" />
                    </div>

                    {/* Post widgets */}
                    {/* <div className="flex flex-row gap-4 px-4 py-4 text-sm text-slate-700">
                        <div>like icon with on click</div>
                        <div>{like_count}</div>
                        <div>comment button</div>
                        <div>Bookmark</div>
                    </div> */}
                    {/* Post widgets */}



                    {/* Updated post widgets */}

                    <div className="flex flex-row gap-4 px-4 py-4 text-sm">
                        {/* <div>{is_liked ? "❤️" : "🤍"}</div> */}
                            {/* <button onClick={() => handleLike(post.id)}>
                                {isLiked ?
                                    <Heart className="w-7 h-7 fill-red-500 text-primary-border hover:text-slate-100"/> :
                                    <Heart className="w-7 h-7 text-primary-border hover:text-slate-100"/>
                                }
                            </button>
                            
                            <div>{likeCount} likes</div> */}
                        <PostLikeButton supabase={supabase} post_id={post.id} like_count={post.like_count} initial_liked={post.is_liked} />
                        
                        {/* <div>comment button</div> */}
                        <Link href={`/app/p/${post.id}`} aria-label="Open post">
                            <MessageCircle />
                        </Link>
                        <div>Comment</div>
                        <div>Bookmark</div>
                    </div>

                    {/* // widget like comment + bookmark; as row
                    // top comment section col */}
                </div>
            ))}
            </InfiniteScroll>
        </div>
    );
}

// check how the styling changes
// add more db entries
// routing on sidebar -> done!!